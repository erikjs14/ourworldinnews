import { TRANSLATE_TO } from '../../config/consts';
import sourcesConfig from '../../config/sourceConfig.json';
import { fbGetTopArticles, fbSaveTopArticles } from "../../sourceFetching/firebase";
import { fetchTopStories } from '../../sourceFetching/topStories';
import { translateToAll } from '../../sourceFetching/translate';
import { CountriesNews } from '../../types';

export default async function handler(req, res) {

    if (req.method === 'GET') {
        // fetch data from firebase
        const cachedNews = await fbGetTopArticles(Object.keys(sourcesConfig.countryConfigs));

        // filter countries not returned by firebase
        const toFetch = Object.keys(sourcesConfig.countryConfigs).filter(k => !cachedNews[k]);

        // fetch non-cached data from news apis
        let newNews = await fetchTopStories(toFetch);

        // sort out countries for which no article was returned
        Object.keys(cachedNews).forEach(key => {
            if (!cachedNews[key].topArticle) {
                delete cachedNews[key];
            }
        });
        Object.keys(newNews).forEach(key => {
            if (!newNews[key].topArticle) {
                delete newNews[key];
            }
        });

        // translate new data
        if (Object.keys(newNews).length > 0) {
            await translateToAll(newNews, TRANSLATE_TO);
        }

        // if not all countries are returned by fetchTopStories (e.g. api limit reached for some reason)
        // refetch them from cache
        const unfetched = toFetch.filter(iso => !newNews[iso]);
        if (unfetched.length > 0) {
            const refetchedNews = await fbGetTopArticles(unfetched, true);
            newNews = {
                ...newNews,
                ...refetchedNews,
            };
        }

        // merge with cached data
        const news: CountriesNews = {
            ...cachedNews,
            ...newNews,
        };

        // only send shallow news to client
        const shallowNews = {};
        Object.keys(news).forEach(isoA2 => {
            shallowNews[isoA2] = {
                isoA2,
                countryName: news[isoA2].countryName,
                expAt: news[isoA2].expAt,
                topArticle: {
                    title: news[isoA2].topArticle.title,
                    titleTranslated: {
                        ...news[isoA2].topArticle.titleTranslated,
                    },
                    imgLink: news[isoA2].topArticle.imgLink,
                    published: news[isoA2].topArticle.published,
                    originalSourceLink: news[isoA2].topArticle.originalSourceLink,
                    sourceDomain: news[isoA2].topArticle.sourceDomain,
                }
            }
        })

        res.status(200).json(shallowNews);

        // save new data to firebase
        await fbSaveTopArticles(newNews);
    }
}