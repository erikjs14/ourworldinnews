import Article from '../../components/Article';
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import Head from 'next/head';
import { Layout } from 'antd';
import { TRANSLATE_TO } from "../../config/consts";
import { fetchTopStoriesOf } from "../../sourceFetching/topStories";
import { translateOneToAll } from "../../sourceFetching/translate";
import { TranslatableArticle } from "../../types";
import layoutStyles from '../../styles/Layout.module.scss';
import Sider from '../../components/Sider';
import useNewsLang from './../../hooks/useNewsLang';
import MiniMap from "../../components/MiniMap";
import { useRouter } from 'next/router';
import styles from '../../styles/Top.module.scss';
import { useContext, useMemo } from "react";
import { topVariants, topChildrenVariants } from '../../animation/top';
import RouteContext from '../../lib/RouteContext';
import globalState from '../../lib/GlobalState' ;
import { fbGetTopArticle, fbSaveTopArticle } from '../../sourceFetching/firebase';
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
TopArticle.showFooter = true;

export const  getServerSideProps: GetServerSideProps = async ({ params, query }) => {

    // fetch country data from firebase (force if nf query param is set)
    // forcing prevents this site showing a different article when coming from index.tsx
    let news = await fbGetTopArticle(params.isoA2 as string, query.nf === 'true');

    // if not cached by fb -> fetch from api
    if (!news) {
        news = await fetchTopStoriesOf(params.isoA2 as string);

        // if not returned, in case of api limit, force fetch from cache
        if (!news?.topArticle && query.nf !== 'true') {
            news = await fbGetTopArticle(params.isoA2 as string, true);
        } else if (news?.topArticle) {
            // translate
            await translateOneToAll(news, TRANSLATE_TO);

            // save to fb
            await fbSaveTopArticle(params.isoA2 as string, news);
        }
    }

    // return props
    return {
        props: {
            countryName: news?.countryName || null,
            article: news?.topArticle || null,       
        },
    }

}   