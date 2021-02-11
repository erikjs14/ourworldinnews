import { CountriesNews, CountryNews } from "../types";

const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate({
    credentials: {
        project_id: process.env.GOOGLE_CREDENTIAL_PROJECT_ID,
        private_key: process.env.GOOGLE_CREDENTIAL_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CREDENTIAL_CLIENT_EMAIL,
    }
});

export const translateTo = async (texts: string[], toIsoA2: string): Promise<string[]> => {
    try {
        let [ translations ] = await translate.translate(texts, toIsoA2);
        translations = Array.isArray(translations) ? translations : [translations];
        if (translations.length < 1) throw new Error('No translation found');

        return translations;
    } catch (error) {
        console.log(error);
        return texts;
    }
}

// !!! mutates news
export const translateOneToAll = async (news: CountryNews, langCodes: string[]) => {
    if (news.topArticle?.title && news.topArticle?.teaser) {
        await Promise.all(langCodes.map(async lang => {
            const [translatedArticle, translatedTeaser] = await translateTo(
                [news.topArticle.title, news.topArticle.teaser],
                lang
            );
            news.topArticle.titleTranslated[lang] = translatedArticle;
            news.topArticle.teaserTranslated[lang] = translatedTeaser;
        }));
    }
}

// !!! mutates news
export const translateToAll = async (news: CountriesNews, langCodes: string[]) => {
    const titles = Object.values(news).map((val: CountryNews) => val.topArticle.title);
    const teasers = Object.values(news).map((val: CountryNews) => val.topArticle.teaser);
    await Promise.all(langCodes.map(async lang => {
        const [translatedTitles, translatedTeasers] = await Promise.all([
            translateTo(titles, lang),
            translateTo(teasers, lang),
        ]);
        Object.keys(news).forEach((key, i) => {
            news[key].topArticle.titleTranslated[lang] = translatedTitles[i];
            news[key].topArticle.teaserTranslated[lang] = translatedTeasers[i];
        });
    }));
}