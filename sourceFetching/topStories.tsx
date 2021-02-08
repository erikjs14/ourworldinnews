import source from '../config/sourceConfig.json';
import axios from 'axios';
import { getDateDiffInFormat } from './../utils/timeUtils';
import { CountriesNews, CountryNews } from '../types';
import { GetTopStoriesResponse } from '../config/sourceConfigRestResponse';
import countries from 'i18n-iso-countries';
import cache from 'memory-cache';
import { TTL_NEWS } from './../config/consts';

export const fetchTopStoriesOf = async (isoA2: string, limit: number = 1): Promise<CountryNews> => {
    try {

        // try to read from cache before making request
        const cachedData: CountryNews = cache.get(isoA2) as (CountryNews | null);
        if (cachedData) {
            return cachedData;
        }

        const result = await axios.get<GetTopStoriesResponse>(
            source.baseUrl + source.endpoints.top,
            {
                params: {
                    [source.apiKey.paramName]: source.apiKey.key,
                    [source.params.linguistics.country.paramName]: isoA2.toLowerCase(),
                    [source.params.publishDate.publishedAfter.paramName]: getDateDiffInFormat(source.countryConfigs[isoA2]?.daysInPast + 1 || 1, source.params.publishDate.publishedAfter.format),
                    limit,
                    ...(source.countryConfigs[isoA2]?.additionalReqParams || {}),
                }
            }
        );
        if (result.status !== 200) throw Error('Response status code was not 200.');

        if (result.data?.data?.length > 0) {

            const countryNews: CountryNews = {
                isoA2,
                countryName: countries.getName(isoA2, 'en', {select: 'official'}),
                topArticle: {
                    title: result.data.data[0].title,
                    titleTranslated: {},
                    teaser: result.data.data[0].snippet,
                    teaserTranslated: {},
                    imgLink: result.data.data[0].image_url,
                    originalSourceLink: result.data.data[0].url,
                    published: result.data.data[0].published_at,
                    sourceDomain: result.data.data[0].source,
                }
            };
            cache.put(isoA2, countryNews, TTL_NEWS);
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
    const results: CountryNews[] = await Promise.all(
        Object.keys(source.countryConfigs).map(iso => fetchTopStoriesOf(iso))
    );
    
    const out: CountriesNews = {};
    results.forEach(cn => out[cn.isoA2] = cn);
    return out;
}