export interface CountryNews {
    isoA2: string;
    countryName: string;
    topArticle: {
        title: string;
        teaser: string;
        imgLink: string;
        published: string;
        originalSourceLink: string;
    } | null;
}

export interface CountriesNews {
    [string]: CountryNews;
} 