import { ReactNode, useState } from 'react';
import { Layout } from 'antd';
import Head from 'next/head'
import Tooltip from 'react-tooltip';
import countries from 'i18n-iso-countries';

import styles from '../styles/Home.module.scss'

import WorldMap from '../components/WorldMap';
import { GetStaticProps } from 'next';
import { fetchTopStories } from '../sourceFetching/topStories';
import { CountriesNews } from '../types';
import { CountryNews } from './../types.d';
import { TRANSLATE_TO } from '../config/consts';
import { translateTo } from './../sourceFetching/translate';
import LangPicker, { DONT_TRANSLATE_VAL } from '../components/LangPicker';
import getMainLayout from './../layout/getMainLayout';

interface HomeProps {
    news: CountriesNews;
}
export default function Home({ news }: HomeProps) {

    const [tooltipContent, setTooltipContent] = useState<ReactNode>(null);
    const [newsLang, setNewsLang] = useState(DONT_TRANSLATE_VAL);

    return (
        <>
            <Head>
                <title>OurWorldInNews</title>
            </Head>

            <Layout.Sider 
                width={300}
                className={styles.leftAside}
            >

                <div className={styles.intro}>
                    <h3>Hello there!</h3>
                    <p>Try hovering the countries in the map and start discovering what's going on around the world.</p>
                    <p>You can pick a language to have the texts translated.</p>
                </div>

                <LangPicker
                    className={styles.langCard}
                    langs={TRANSLATE_TO.map(iso => ({
                        value: iso,
                        label: iso.toUpperCase(),
                    }))}
                    value={newsLang}
                    onChange={setNewsLang}
                />
            </Layout.Sider>
            <Layout.Content style={{ backgroundColor: '#fff' }}>
                <div className={styles.mapContainer}>
                    <WorldMap 
                        setTooltipContent={setTooltipContent} 
                        news={news}
                        translateTo={newsLang}
                    />
                    <Tooltip
                        backgroundColor='#eee'
                        textColor='#000'
                        className={styles.tooltip}
                    >
                        {tooltipContent}
                    </Tooltip>
                </div>
            </Layout.Content>

        </>
    )
}
Home.Layout = getMainLayout('home', false);

export const getStaticProps: GetStaticProps = async (context) => {
    // fetch news
    const news: CountriesNews = await fetchTopStories();
    // translate
    const titles = Object.values(news).map((val: CountryNews) => val.topArticle.title);
    const teasers = Object.values(news).map((val: CountryNews) => val.topArticle.teaser);
    TRANSLATE_TO.forEach(async lang => {
        const [translatedTitles, translatedTeasers] = await Promise.all([
            translateTo(titles, lang),
            translateTo(teasers, lang),
        ]);
        Object.keys(news).forEach((key, i) => {
            news[key].topArticle.titleTranslated[lang] = translatedTitles[i];
            news[key].topArticle.teaserTranslated[lang] = translatedTeasers[i];
        });
    })

    // fs.writeFileSync('news.json', JSON.stringify(news));

    return {
        props: {
            news,
        },
    };
}