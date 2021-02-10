export interface TranslatableArticle {
    title: string;
    titleTranslated: {
        [string]: string; // en: "this is tranlated title"
    };
    teaser: string;
    teaserTranslated: {
        [string]: string;
    };
    imgLink: string;
    published: string;
    originalSourceLink: string;
    sourceDomain: string;
    uuid: string;
}

export interface CountryNews {
    isoA2: string;
    countryName: string;
    topArticle: TranslatableArticle | null;
}

export interface CountriesNews {
    [string]: CountryNews;
} 