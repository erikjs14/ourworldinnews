import * as admin from 'firebase-admin';
import { isValid } from '../utils/util';
import { CountryNews, CountriesNews } from './../types.d';

const serviceAccount = {
    projectId: process.env.GOOGLE_FIREBASE_CREDENTIAL_PROJECT_ID,
    privateKey: process.env.GOOGLE_FIREBASE_CREDENTIAL_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.GOOGLE_FIREBASE_CREDENTIAL_CLIENT_EMAIL,
}

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

const db = admin.firestore();

const COL_REF_TOP_ARTICLE = 'top';

export const fbSaveTopArticle = async (isoA2: string, article: CountryNews) => {
    await db.collection(COL_REF_TOP_ARTICLE).doc(isoA2).set(article);
}

export const fbSaveTopArticles = async (articles: CountriesNews) => {
    const batch = db.batch();
    for (let isoA2 of Object.keys(articles)) {
        const doc = db.collection(COL_REF_TOP_ARTICLE).doc(isoA2);
        batch.set(doc, articles[isoA2]);
    }
    await batch.commit();
}

export const fbGetTopArticle = async (isoA2: string, ignoreTtl: boolean = false): Promise<CountryNews | null> => {
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

export const fbGetTopArticles = async (countryCodes: string[]): Promise<CountriesNews> => {
    try {
        const snap = await db.collection(COL_REF_TOP_ARTICLE).get();
        if (snap.empty) {
            return {};
        } else {
            const news: CountriesNews = {};
            snap.forEach(doc => {
                const newsData = doc.data() as CountryNews;
                if (countryCodes.includes(newsData.isoA2) && isValid(newsData.expAt)) {
                    news[newsData.isoA2] = newsData;
                }
            });
            return news;
        }
    } catch (error) {
        return {};
    }
}