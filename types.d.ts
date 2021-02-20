export interface ShallowTranslatableArticle {
    title: string;
    titleTranslated: {
        [string]: string; // en: "this is tranlated title"
    };
    imgLink: string;
    published: string;
    originalSourceLink: string;
    sourceDomain: string;
}

export interface TranslatableArticle extends ShallowTranslatableArticle {
    teaser: string;
    teaserTranslated: {
        [string]: string;
    };
}

export interface ShallowCountryNews {
    isoA2: string;
    countryName: string;
    expAt: number;
    topArticle: ShallowTranslatableArticle | null;
}
export interface CountryNews extends ShallowCountryNews {
    topArticle: TranslatableArticle | null;
}

export interface ShallowCountriesNews {
    [key: string]: ShallowCountryNews;
}

export interface CountriesNews {
    [key: string]: CountryNews;
} 