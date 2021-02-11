import source from '../config/sourceConfig.json';
import axios from 'axios';
import { getDateDiffInFormat } from './../utils/timeUtils';
import { CountriesNews, CountryNews } from '../types';
import { GetTopStoriesResponse } from '../config/sourceConfigRestResponse';
import countries from 'i18n-iso-countries';
import cache from '../cache/cache';
const fs = require('fs');
import path from'path';
import { TOP_NEWS_TTL } from '../config/consts';
import { toHttps } from '../utils/util';

export const fetchTopStoriesOf = async (isoA2: string, limit: number = 1): Promise<CountryNews> => {
    try {

        // try to read from cache before making request
        const cachedData: CountryNews = await cache.get(`top-${isoA2}`);
        if (cachedData) {
            return cachedData;
        }

        const result = await axios.get<GetTopStoriesResponse>(
            source.baseUrl + source.endpoints.top,
            {
                params: {
                    [source.apiKey.paramName]: process.env[source.apiKey.key],
                    [source.params.linguistics.country.paramName]: isoA2.toLowerCase(),
                    [source.params.publishDate.publishedAfter.paramName]: getDateDiffInFormat(source.countryConfigs[isoA2]?.daysInPast + 1 || 1, source.params.publishDate.publishedAfter.format),
                    limit,
                    ...(source.countryConfigs[isoA2]?.additionalReqParams || {}),
                }
            }
        );
        if (result.status !== 200) throw Error('Response status code was not 200.');

        if (result.data?.data?.length > 0) {

            const uuid = result.data.data[0].uuid;
            const countryNews: CountryNews = {
                isoA2,
                countryName: countries.getName(isoA2, 'en', {select: 'official'}),
                topArticle: {
                    title: result.data.data[0].title,
                    titleTranslated: {},
                    teaser: result.data.data[0].snippet,
                    teaserTranslated: {},
                    imgLink: toHttps(result.data.data[0].image_url),
                    originalSourceLink: result.data.data[0].url,
                    published: result.data.data[0].published_at,
                    sourceDomain: result.data.data[0].source,
                    uuid,
                }
            };
            return countryNews;

        } else {
            throw Error('No data returned.');
        }

    } catch (error) {
        return {
            isoA2,
            countryName: countries.getName(isoA2, 'en', {select: 'official'}),
            topArticle: null,
        };
    }
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
        Object.keys(source.countryConfigs).map(iso => fetchTopStoriesOf(iso))
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