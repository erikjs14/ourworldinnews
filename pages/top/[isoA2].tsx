import { GetStaticPaths, GetStaticProps } from "next";
import Head from 'next/head';
import { Layout } from 'antd';
import { TRANSLATE_TO } from "../../config/consts";
import getMainLayout from "../../layout/getMainLayout";
import { fetchTopStories } from "../../sourceFetching/topStories";
import { translateToAll } from "../../sourceFetching/translate";
import { CountriesNews, CountryNews, TranslatableArticle } from "../../types";
import cache from '../../cache/cache';
import layoutStyles from '../../styles/Layout.module.scss';
import Sider from '../../components/Sider';
import useNewsLang from './../../hooks/useNewsLang';
import MiniMap from "../../components/MiniMap";
import { useRouter } from 'next/router';
import styles from '../../styles/Top.module.scss';
import { useMemo } from "react";

interface TopArticleProps {
    countryName: string;
    article: TranslatableArticle;
}

export default function TopArticle({ countryName, article }: TopArticleProps) {

    const router = useRouter();
    const { isoA2 } = router.query;

    const { newsLang, setNewsLang } = useNewsLang();

    const minimap = useMemo(() => (
        <div className={styles.mapWrapper}>
            <MiniMap
                highlightCountry={isoA2 as string}
            />
        </div>
    ), [isoA2]);

    return (
        <>
            <Head>
                <title>Top Article - {countryName}</title>
            </Head>

            <Layout hasSider>

                <Sider
                    initiallyCollapsed
                    showSiderFor={0}
                    newsLang={newsLang}
                    setNewsLang={setNewsLang}
                >
                    {() => minimap}
                </Sider>

                <Layout.Content className={layoutStyles.maxContainer}>
                    CONTENT
                </Layout.Content>

            </Layout>
        </>
    );
}
TopArticle.Layout = getMainLayout('irrelevant', true, false);

export const getStaticPaths: GetStaticPaths = async () => {

    // get top stories (either fetch or read from cache if already fetched by index.tsx)
    const topStories: CountriesNews = await fetchTopStories();

    // sort out countries for which no article was returned
    Object.keys(topStories).forEach(key => {
        if (!topStories[key].topArticle) {
            delete topStories[key];
        }
    });

    if (Object.keys(topStories).length > 0) {
        translateToAll(topStories, TRANSLATE_TO);
    }

    const paths = Object.values(topStories).map(val => ({ params: { isoA2: val.isoA2} }));

    return {
        paths,
        fallback: false,
    }


}

export const  getStaticProps: GetStaticProps = async ({ params }) => {

    const isoA2 = params.isoA2 as string;

    // article should be in cache by now
    let data = await cache.get(`top-${isoA2}`);
    
    if (!data) {

        // if in dev -> read from file
        if (process.env.NODE_ENV !== 'production') {
            const allStories = await fetchTopStories() as (CountryNews);
            if (allStories && allStories[isoA2]) {
                data = allStories[isoA2];
            }
        }

        if (!data) {
            return {
                notFound: true,
            }
        }
    }

    return {
        props: {
            countryName: data.countryName,
            article: data.topArticle,       
        },
    }

}   