import Article from '../../components/Article';
import { GetServerSideProps } from "next";
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
import sourcesConfig from '../../config/sourceConfig.json';

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

    const isoA2 = params.isoA2 as string;

    // fetch country data from firebase (force if nf query param is set)
    // forcing prevents this site showing a different article when coming from index.tsx
    let news = await fbGetTopArticle(isoA2, query.nf === 'true');

    // if not cached by fb -> fetch from api if valid country code
    if (!news && Object.keys(sourcesConfig.countryConfigs).includes(isoA2)) {
        news = await fetchTopStoriesOf(isoA2);

        if (news?.topArticle) {
            // translate
            await translateOneToAll(news, TRANSLATE_TO);
        }

        // save to fb
        await fbSaveTopArticle(isoA2, news);
    }

    // return props
    return {
        props: {
            countryName: news?.countryName || null,
            article: news?.topArticle || null,       
        },
    }

}   