import axios from "axios";
import { useEffect, useState } from "react";
import { ShallowCountriesNews } from "../types";
import globalState from '../lib/GlobalState';
const { useGlobalState } = globalState;

export default function useTopArticles(): {
    news: ShallowCountriesNews;
    isLoading: boolean;
    isError: any;
} {

    const [news, setNews] = useGlobalState('shallowNews');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!news) {
            axios.get('/api/top-articles')
                .then(res => {
                    setNews(res.data);
                    setError(null);
                })
                .catch(err => {
                    setNews(null);
                    setError(err);
                });
        }
    }, [news]);

    return {
        news: news || {},
        isLoading: !error && !news,
        isError: error !== null,
    };
}