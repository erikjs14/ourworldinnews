import axios from 'axios';
import { CountriesNews, CountryNews } from "../types";
import { splitArray, subset } from './../utils/util';

// !!! mutates news
export const translateOneToAll = async (news: CountryNews, langCodes: string[]) => {
    if (!news || !news.topArticle) return;
    try {
        const query = '?api-version=3.0&to=' + langCodes.join('&to=');
        const res = await axios.post('https://api.cognitive.microsofttranslator.com/translate' + query, 
        [ { Text: news.topArticle.title } , { Text: news.topArticle.teaser } ], 
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATOR_KEY,
                    'Ocp-Apim-Subscription-Region': process.env.AZURE_TRANSLATOR_REGION,
                }
            }
        );
        const propTranslated = [ 'titleTranslated', 'teaserTranslated' ];
        res.data.forEach((data, idx) => {
            data.translations.forEach(trans => {
                news.topArticle[propTranslated[idx]][trans.to] = trans.text;
            })
        });
    } catch (error) {
        return;
    }
}

// !!! mutates news
export const translateToAll = async (news: CountriesNews, langCodes: string[]) => {
    if (langCodes.length === 0) return;
    const tmp_news = { ...news };
    Object.keys(tmp_news).forEach(key => {
        if (!tmp_news[key].topArticle) {
            delete tmp_news[key];
        }
    });
    if (Object.keys(tmp_news).length === 0) {
        return;
    }

    try {
        const query = '?api-version=3.0&to=' + langCodes.join('&to=');
        // split news so that limit of 10000 chars and 100 array entries is not reached
        const doQuery = async (tmp_news: CountriesNews, prop: string, propTranslated: string) => {
            const isoCodes = Object.keys(tmp_news);
            const res = await axios.post('https://api.cognitive.microsofttranslator.com/translate' + query, 
                isoCodes.map((key: keyof typeof tmp_news) => ({ Text: tmp_news[key].topArticle[prop] }) ), 
                {
                    headers: {
                        'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATOR_KEY,
                        'Ocp-Apim-Subscription-Region': process.env.AZURE_TRANSLATOR_REGION,
                    }
                }
            );
            res.data.forEach((data, idx) => {
                const iso = isoCodes[idx];
                data.translations.forEach(trans => {
                    news[iso].topArticle[propTranslated][trans.to] = trans.text;
                })
            })
        }
        // split into arrays of size 20 to do the requests
        const allIsoCodes = Object.keys(tmp_news);
        const splitIsoCodes = splitArray(allIsoCodes, 20);
        await Promise.allSettled(
            splitIsoCodes.map(codes => doQuery(subset(tmp_news, codes), 'title', 'titleTranslated'))
                .concat(splitIsoCodes.map(codes => doQuery(subset(tmp_news, codes), 'teaser', 'teaserTranslated')))
        );
    } catch (error) {
        return;
    }
}