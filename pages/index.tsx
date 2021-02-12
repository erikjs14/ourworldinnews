import { useEffect, useState } from 'react';
import { Layout, Tooltip, Typography } from 'antd';
import moment from 'moment';
import Head from 'next/head'
import { useRouter } from 'next/router';
import NewsTooltip from 'react-tooltip';
import DragIndicator from '../assets/drag-indicator.svg';
import ZoomIndicator from '../assets/zoom-indicator.svg';

import styles from '../styles/Home.module.scss'

import WorldMap from '../components/WorldMap';
import { GetStaticProps } from 'next';
import { fetchTopStories } from '../sourceFetching/topStories';
import { CountriesNews } from '../types';
import { TOP_NEWS_TTL, TRANSLATE_TO } from '../config/consts';
import { translateToAll } from './../sourceFetching/translate';
import getMainLayout from './../layout/getMainLayout';
import BubbleContent from '../components/BubbleContent';
import Sider from '../components/Sider';
import useNewsLang from '../hooks/useNewsLang';
import { motion } from 'framer-motion';
import { homeVariants, mapVariants } from '../animation/home';
import { useContext } from 'react';
import RouteContext from '../lib/RouteContext';
import globalState from '../lib/GlobalState' ;
import { isMobile } from '../utils/util';
const { useGlobalState } = globalState;

const { Title, Paragraph } = Typography;

export interface CountryHoveredInfo {
    countryName: string;
    isoA2: string;
}
interface HomeProps {
    news: CountriesNews;
    availableCountries: Array<string>;
}

let newsTooltipShown = false; // set after timeout when tooltip is visible --> better handling on mobile devices
let timeoutRef = null;
export default function Home({ news, availableCountries }: HomeProps) {

    // reset news tooltip state for mobile handling
    useEffect(() => {
        newsTooltipShown = false;
    }, []);

    const router = useRouter();
    const oldRoute = useContext(RouteContext);

    const [siderCollapsed, setSiderCollapsed] = useGlobalState('siderCollapsed');
    const [clientRouted] = useGlobalState('clientRouted');
    const [zoomState, setZoomState] = useGlobalState('mapZoomState');

    const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);
    const { newsLang, setNewsLang } = useNewsLang();

    // pre-fetch images of articles
    useEffect(() => {
        Object.values(news).forEach(n => {
            new Image().src = n.topArticle.imgLink;
        })
    }, []);

    const countryHoverHandler = (info: CountryHoveredInfo) => {
        if (info) {
            const topArt = news[info.isoA2].topArticle;
            if (topArt) {
                // prefetch route
                router.prefetch(`/top/${info.isoA2}`);
                setTooltipContent(
                    <BubbleContent
                        title={
                            topArt.titleTranslated?.[newsLang] 
                                 || topArt.title
                        }
                        countryName={info.countryName}
                        imgUrl={topArt.imgLink}
                        sourceDomain={topArt.sourceDomain}
                        time={moment(topArt.published)}
                    />
                );
                // prevent mouseenter and click being fired when clicking on mobile
                timeoutRef = setTimeout(() => newsTooltipShown = true, 150);
            }
        } else {
            if (timeoutRef) clearTimeout(timeoutRef);
            timeoutRef = null;
            setTooltipContent(null);
            newsTooltipShown = false;
        }
    }

    const clickHandler = (isoA2: string, countryName: string) => {
        if (news[isoA2]) {
            // if touch-device -> open tooltip
            if (!('ontouchstart' in document.documentElement) || newsTooltipShown) {
                router.push(`/top/${isoA2}`);
                newsTooltipShown = false;
            }            
        } 
    }

    return (
        <>
            <Head>
                <title>OurWorldInNews</title>
            </Head>

            <motion.div 
                initial='hidden' animate='visible' exit='exit' variants={homeVariants(oldRoute)}
                className={styles.wrapper}
            >
                <Sider
                    newsLang={newsLang}
                    setNewsLang={setNewsLang}
                    collapsed={siderCollapsed}
                    setCollapsed={setSiderCollapsed}
                    slideInIfBig={!clientRouted}
                    oldRoute={oldRoute}
                >
                    { (siderCollapsed) => (
                        <div className={styles.intro + (siderCollapsed ? ' '+styles.hidden : '')}>
                            <Title level={3}>Hello there!</Title>
                            <Paragraph>Try hovering the countries in the map and start discovering what's going on around the world.</Paragraph>
                            <Paragraph>You can pick a language to have the texts translated.</Paragraph>
                        </div>
                    )}
                </Sider>

                <Layout.Content 
                    style={{ backgroundColor: '#fff' }}
                >
                    <motion.div
                        variants={mapVariants(oldRoute)}
                        className={styles.mapContainer}
                    >
                        <WorldMap 
                            setCountryHovered={countryHoverHandler} 
                            available={availableCountries}
                            onCountryClicked={clickHandler}
                            zoom={zoomState.zoom}
                            coordinates={zoomState.coordinates}
                            onZoomEnd={pos => {
                                setZoomState({
                                    coordinates: pos.coordinates,
                                    zoom: pos.zoom
                                });
                            }}
                        />
                        <NewsTooltip
                            backgroundColor='#eee'
                            textColor='#000'
                            className={styles.tooltip}
                            effect='float'
                        >
                            {tooltipContent}
                        </NewsTooltip>
                        <Tooltip title='Drag the map' mouseEnterDelay={0.3} >
                            <DragIndicator className={styles.dragIndicator} />
                        </Tooltip>
                        <Tooltip title='Zoom using the mouse wheel' mouseEnterDelay={0.3} placement='topLeft'>
                            <ZoomIndicator className={styles.zoomIndicator} />
                        </Tooltip>
                    </motion.div>
                </Layout.Content>
            </motion.div>
        </>
    )
}
Home.Layout = getMainLayout('home', false, false);

export const getStaticProps: GetStaticProps = async (context) => {
    // fetch news
    const news: CountriesNews = await fetchTopStories();

    // sort out countries for which no article was returned
    Object.keys(news).forEach(key => {
        if (!news[key].topArticle) {
            delete news[key];
        }
    });

    // translate
    if (Object.keys(news).length > 0) {
        await translateToAll(news, TRANSLATE_TO);
    }

    const availableCountries = {};
    Object.keys(news).forEach(key => availableCountries[key] = true);

    // fs.writeFileSync('news.json', JSON.stringify(news));

    return {
        props: {
            news,
            availableCountries,
        },
        revalidate: TOP_NEWS_TTL,
    };
}