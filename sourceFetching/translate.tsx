const { Translate } = require('@google-cloud/translate').v2;
const translate = new Translate();

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