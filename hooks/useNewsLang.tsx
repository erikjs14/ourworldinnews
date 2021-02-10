import { useEffect, useState } from 'react';
import { ST_NEWS_LANG_KEY } from '../config/consts';
import { DONT_TRANSLATE_VAL } from './../components/LangPicker';

export default function useNewsLang() {

    const [lang, setLang] = useState(DONT_TRANSLATE_VAL);

    useEffect(() => {
        const st = sessionStorage.getItem(ST_NEWS_LANG_KEY);
        if (st) setLang(st);
    }, []);

    const setNewsLang = (newLang: string) => {
        sessionStorage.setItem(ST_NEWS_LANG_KEY, newLang);
        setLang(newLang);
    }

    return {
        newsLang: lang,
        setNewsLang,
    };
}