import sourcesConfig from '../config/sourceConfig.json';
import axios from 'axios';
import { getDateDiffInFormat } from './../utils/timeUtils';
import { CountriesNews, CountryNews } from '../types';
import countries from 'i18n-iso-countries';
import cache from '../cache/cache';
const fs = require('fs');
import path from'path';
import { TOP_NEWS_TTL } from '../config/consts';
import { toHttps } from '../utils/util';
import { accessViaDot } from './../utils/util';

const rawFetchFromSource = async (isoA2: string, limit: number, api: keyof typeof sourcesConfig.sources) => {

    const source = sourcesConfig.sources[api];
    try {
        const result = await axios.get(
            source.baseUrl + source.endpoints.top,
            {
                params: {
                    [source.apiKey.paramName]: process.env[source.apiKey.key],
                    [source.params.linguistics.country.paramName]: isoA2.toLowerCase(),
                    [source.params.publishDate?.publishedAfter.paramName]:  source.params.publishDate ? getDateDiffInFormat(sourcesConfig.countryConfigs[isoA2]?.daysInPast + 1 || 1, source.params.publishDate.publishedAfter.format) : undefined,
                    [source.params.pagination.limitParamName]: limit,
                    ...(sourcesConfig.countryConfigs[isoA2]?.additionalReqParams || {}),
                }
            }
        );
        if (result.status !== 200) return null;

        const articles = result.data?.[source.responseMap.articles]
        if (articles?.length > 0) {
            const map = source.responseMap.articleMap;

            const uuid = map.uuid ? articles[map.uuid] : null;
            const article = articles[0];
            const countryNews: CountryNews = {
                isoA2,
                countryName: countries.getName(isoA2, 'en', {select: 'official'}),
                topArticle: {
                    title: article[map.title],
                    titleTranslated: {},
                    teaser: map.teaser.map(p => article[p]).join(' \n '),
                    teaserTranslated: {},
                    imgLink: toHttps(article[map.imgLink]),
                    originalSourceLink: article[map.originalSourceLink],
                    published: article[map.published],
                    sourceDomain: accessViaDot(article, map.sourceDomain),
                    uuid,
                }
            };
            return countryNews;

        } else {
            return null;
        }
    
    } catch (error) {
        return null;
    }
}

export const fetchTopStoriesOf = async (isoA2: string, limit: number = 1): Promise<CountryNews> => {

    // try to read from cache before making request
    const cachedData: CountryNews = await cache.get(`top-${isoA2}`);
    if (cachedData) {
        return cachedData;
    }

    let countryNews = null;
    for (let api of sourcesConfig.sourcePriority) {
        countryNews = await rawFetchFromSource(isoA2, limit, api as keyof typeof sourcesConfig.sources);
        if (countryNews) return countryNews;
    }

    return {
        isoA2,
        countryName: countries.getName(isoA2, 'en', {select: 'official'}),
        topArticle: null,
    };

}

export const fetchTopStories = async (): Promise<CountriesNews> => {

    // if in dev -> try to read from file
    if (process.env.NODE_ENV !== 'production') {
        if (fs.existsSync(path.join(process.cwd(), 'news.json'))) {
            console.log('read from file');
            const data: CountriesNews = JSON.parse(fs.readFileSync('news.json'));
            for (let entry of Object.entries(data)) {
                await cache.put(`top-${entry[0]}`, entry[1], TOP_NEWS_TTL * 1000);
            }
            return data;
        }
    }
    
    const results: CountryNews[] = await Promise.all(
        Object.keys(sourcesConfig.countryConfigs).map(iso => fetchTopStoriesOf(iso))
    );
    
    const out: CountriesNews = {};
    for (let cn of results) {
        await cache.put(`top-${cn.isoA2}`, cn, TOP_NEWS_TTL * 1000);
        out[cn.isoA2] = cn;
    }

    // if in dev -> write to file
    if (process.env.NODE_ENV !== 'production') {
        fs.writeFileSync(path.join(process.cwd(), 'news.json'), JSON.stringify(out));
    }

    return out;
}