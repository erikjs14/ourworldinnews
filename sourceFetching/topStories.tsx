import sourcesConfig from '../config/sourceConfig.json';
import axios from 'axios';
import { getDateDiffInFormat } from './../utils/timeUtils';
import { CountriesNews, CountryNews } from '../types';
import countries from 'i18n-iso-countries';
import { toHttps } from '../utils/util';
import { accessViaDot } from './../utils/util';

const rawFetchFromSource = async (isoA2: string, api: keyof typeof sourcesConfig.sources): Promise<CountryNews | null> => {

    const source = sourcesConfig.sources[api];
    try {
        const result = await axios.get(
            source.baseUrl + source.endpoints.top,
            {
                params: {
                    [source.apiKey.paramName]: process.env[source.apiKey.key],
                    [source.params.linguistics.country.paramName]: isoA2.toLowerCase(),
                    [source.params.publishDate?.publishedAfter.paramName]:  source.params.publishDate ? getDateDiffInFormat(sourcesConfig.countryConfigs[isoA2]?.daysInPast + 1 || 1, source.params.publishDate.publishedAfter.format) : undefined,
                    [source.params.pagination.limitParamName]: 1,
                    ...(sourcesConfig.countryConfigs[isoA2]?.additionalReqParams || {}),
                }
            }
        );
        if (result.status !== 200) return null;

        const articles = result.data?.[source.responseMap.articles]
        if (articles?.length > 0) {
            const map = source.responseMap.articleMap;

            const article = articles[0];
            const countryNews: CountryNews = {
                isoA2,
                countryName: countries.getName(isoA2, 'en', {select: 'official'}),
                expAt: new Date().getTime() + source.ttl,
                topArticle: {
                    title: article[map.title],
                    titleTranslated: {},
                    teaser: map.teaser.map(p => article[p]).join(' \n '),
                    teaserTranslated: {},
                    imgLink: toHttps(article[map.imgLink]) || null,
                    originalSourceLink: article[map.originalSourceLink],
                    published: article[map.published],
                    sourceDomain: accessViaDot(article, map.sourceDomain),
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

export const fetchTopStoriesOf = async (isoA2: string): Promise<CountryNews> => {

    let countryNews = null;
    for (let api of sourcesConfig.sourcePriority) {
        countryNews = await rawFetchFromSource(isoA2, api as keyof typeof sourcesConfig.sources);
        if (countryNews) return countryNews;
    }

    return {
        isoA2,
        countryName: countries.getName(isoA2, 'en', {select: 'official'}),
        expAt: new Date().getTime() + sourcesConfig.defaultTtl,
        topArticle: null,
    };

}

export const fetchTopStories = async (isoCodes: string[]): Promise<CountriesNews> => {
    
    const results: CountryNews[] = await Promise.all(
        isoCodes.map(iso => fetchTopStoriesOf(iso))
    );
    
    const out: CountriesNews = {};
    for (let cn of results) {
        out[cn.isoA2] = cn;
    }

    return out;
}