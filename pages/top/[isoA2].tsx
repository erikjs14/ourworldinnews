import Article from '../../components/Article';
import { GetStaticPaths, GetStaticProps } from "next";
import Head from 'next/head';
import { Layout } from 'antd';
import { TRANSLATE_TO } from "../../config/consts";
import getMainLayout from "../../layout/getMainLayout";
import { fetchTopStories } from "../../sourceFetching/topStories";
import { translateOneToAll, translateToAll } from "../../sourceFetching/translate";
import { CountriesNews, CountryNews, TranslatableArticle } from "../../types";
import cache from '../../cache/cache';
import layoutStyles from '../../styles/Layout.module.scss';
import Sider from '../../components/Sider';
import useNewsLang from './../../hooks/useNewsLang';
import MiniMap from "../../components/MiniMap";
import { useRouter } from 'next/router';
import styles from '../../styles/Top.module.scss';
import { useContext, useMemo } from "react";
import { topVariants, topChildrenVariants } from '../../animation/top';
import { motion } from 'framer-motion';
import RouteContext from '../../lib/RouteContext';
import globalState from '../../lib/GlobalState' ;
const { useGlobalState } = globalState;

interface TopArticleProps {
    countryName: string;
    article: TranslatableArticle;
}

export default function TopArticle({ countryName, article }: TopArticleProps) {

    const router = useRouter();
    const { isoA2 } = router.query;
    const oldRoute = useContext(RouteContext);

    const { newsLang, setNewsLang } = useNewsLang();
    
    const [siderCollapsed, setSiderCollapsed] = useGlobalState('siderCollapsed');

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
                    collapsed={siderCollapsed}
                    setCollapsed={setSiderCollapsed}
                    newsLang={newsLang}
                    setNewsLang={setNewsLang}
                    oldRoute={oldRoute}
                >
                    {() => minimap}
                </Sider>

                <Layout.Content className={layoutStyles.maxContainer}>
                        <Article
                            data={article}
                            lang={newsLang}
                            countryName={countryName}
                            variants={topVariants(oldRoute)}
                            childrenVariants={topChildrenVariants}
                        />
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

    await translateOneToAll(data, TRANSLATE_TO);

    return {
        props: {
            countryName: data.countryName,
            article: data.topArticle,       
        },
    }

}   