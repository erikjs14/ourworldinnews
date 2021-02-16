import * as admin from 'firebase-admin';
import { isValid } from '../utils/util';
import { CountryNews, CountriesNews } from './../types.d';
import { getSecret } from './secrets';

const getDb = async () => {
    if (!admin.apps.length) {
        const credentials = await getSecret(process.env.FIREBASE_ACCESS_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(credentials)
        });
    }
    return admin.firestore();
}


const COL_REF_TOP_ARTICLE = 'top';

export const fbSaveTopArticle = async (isoA2: string, article: CountryNews) => {
    const db = await getDb();
    await db.collection(COL_REF_TOP_ARTICLE).doc(isoA2).set(article);
}

export const fbSaveTopArticles = async (articles: CountriesNews) => {
    const db = await getDb();
    const batch = db.batch();
    for (let isoA2 of Object.keys(articles)) {
        const doc = db.collection(COL_REF_TOP_ARTICLE).doc(isoA2);
        batch.set(doc, articles[isoA2]);
    }
    await batch.commit();
}

export const fbGetTopArticle = async (isoA2: string, ignoreTtl: boolean = false): Promise<CountryNews | null> => {
    const db = await getDb();
    try {
        const doc = await db.collection(COL_REF_TOP_ARTICLE).doc(isoA2).get();
        if (!doc.exists || (!ignoreTtl && !isValid(doc.data().expAt))) {
            return null;
        } else {
            return doc.data() as CountryNews;
        }
    } catch (error) {
        return null;
    }
}

export const fbGetTopArticles = async (countryCodes: string[], ignoreTtl: boolean = false): Promise<CountriesNews> => {
    const db = await getDb();
    try {
        const snap = await db.collection(COL_REF_TOP_ARTICLE).get();
        if (snap.empty) {
            return {};
        } else {
            const news: CountriesNews = {};
            snap.forEach(doc => {
                const newsData = doc.data() as CountryNews;
                if (countryCodes.includes(newsData.isoA2) && (ignoreTtl || isValid(newsData.expAt))) {
                    news[newsData.isoA2] = newsData;
                }
            });
            return news;
        }
    } catch (error) {
        return {};
    }
}