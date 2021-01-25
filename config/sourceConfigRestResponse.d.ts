export interface GetTopStoriesResponse {
    meta: {
        found: number;
        returned: number;
        limit: number;
        page: number;
    };
    data: Array<{
        uuid: string;
        title: string;
        description: string;
        keywords: string;
        snippet: string;
        url: string;
        image_url: string;
        language: string;
        published_at: string;
        source: string;
        categories: Array<string>;
        relevance_score: number | null;
        locale: string;
    }>;
}