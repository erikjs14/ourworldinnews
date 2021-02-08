const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate({
    credentials: {
        project_id: process.env.GOOGLE_CREDENTIAL_PROJECT_ID,
        private_key: process.env.GOOGLE_CREDENTIAL_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CREDENTIAL_CLIENT_EMAIL,
    }
});

export const translateTo = async (texts: string[], toIsoA2: string): Promise<string[]> => {
    try {
        let [ translations ] = await translate.translate(texts, toIsoA2);
        translations = Array.isArray(translations) ? translations : [translations];
        if (translations.length < 1) throw new Error('No translation found');

        // take just the first translation
        return translations;
    } catch (error) {
        console.log(error);
        return texts;
    }
}