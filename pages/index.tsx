import { useEffect, useState } from 'react';
import { Layout, Tooltip, Typography, Card } from 'antd';
import moment from 'moment';
import Head from 'next/head'
import { useRouter } from 'next/router';
import NewsTooltip from 'react-tooltip';
import DragIndicator from '../assets/drag-indicator.svg';
import ZoomIndicator from '../assets/zoom-indicator.svg';
import PinchIndicator from '../assets/zoom-in.svg';

import styles from '../styles/Home.module.scss'

import WorldMap from '../components/WorldMap';
import { GetServerSideProps, GetStaticProps } from 'next';
import { fetchTopStories } from '../sourceFetching/topStories';
import { CountriesNews } from '../types';
import { TRANSLATE_TO } from '../config/consts';
import sourcesConfig from '../config/sourceConfig.json';
import { translateToAll } from './../sourceFetching/translate';
import BubbleContent from '../components/BubbleContent';
import Sider from '../components/Sider';
import useNewsLang from '../hooks/useNewsLang';
import { motion, AnimatePresence } from 'framer-motion';
import { homeVariants, mapVariants } from '../animation/home';
import { useContext } from 'react';
import RouteContext from '../lib/RouteContext';
import globalState from '../lib/GlobalState' ;
import { fbGetTopArticle, fbGetTopArticles, fbSaveTopArticles } from './../sourceFetching/firebase';
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

let selectedCountry = '';
export default function Home({ news, availableCountries }: HomeProps) {

    useEffect(() => {
        selectedCountry = '';
    }, []);

    const router = useRouter();
    const oldRoute = useContext(RouteContext);

    const [siderCollapsed, setSiderCollapsed] = useGlobalState('siderCollapsed');
    const [clientRouted] = useGlobalState('clientRouted');
    const [zoomState, setZoomState] = useGlobalState('mapZoomState');
    const [mobileNoteHidden, setMobileNoteHidden] = useGlobalState('mobileNoteHidden');

    useEffect(() => {
        const mnh = sessionStorage.getItem('mobileNoteHidden');
        if (mnh) setMobileNoteHidden(true);
    }, []);

    const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);
    const { newsLang, setNewsLang } = useNewsLang();

    const [ isTouch, setIsTouch ] = useState(null);

    useEffect(() => setIsTouch('ontouchstart' in  window || 'ontouchstart' in document.documentElement), []);

    // pre-fetch images of articles
    useEffect(() => {
        Object.values(news).forEach(n => {
            new Image().src = n.topArticle.imgLink;
        })
    }, []);

    const showArticleTooltipHandler = (info: CountryHoveredInfo) => {
        if (info) {
            const topArt = news[info.isoA2]?.topArticle;
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
            }
        }
    }

    const resetTooltip = () => {
        setTooltipContent(null);
        selectedCountry = '';
    }

    const openArticleHandler = (info: CountryHoveredInfo) => {
        if (news[info.isoA2]) {
            router.push({
                pathname: `/top/${info.isoA2}`,
                query: {
                    nf: true,
                },
            });
        } 
    }

    const onTouchStartHandler = (info: CountryHoveredInfo) => {
        if (!info) resetTooltip();
    }

    const onTouchEndHandler = (info: CountryHoveredInfo) => {
        if (selectedCountry === info.isoA2) {
            openArticleHandler(info);
        } else {
            showArticleTooltipHandler(info);
            selectedCountry = info.isoA2;
        }
    }

    const onMouseEnterHandler = (info: CountryHoveredInfo) => {
        if (!info) resetTooltip();
        if (!isTouch) showArticleTooltipHandler(info);
    }

    const onClickHandler = (info: CountryHoveredInfo) => {
        if (!isTouch) openArticleHandler(info);
    }

    const onMouseLeaveHandler = (info: CountryHoveredInfo) => {
        if (!isTouch) resetTooltip();
    }

    const onBlurHandler = (info: CountryHoveredInfo) => {
        if (isTouch && selectedCountry === info.isoA2) {
            resetTooltip();
            selectedCountry = '';
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
                            <Paragraph className={styles.desktop}>Try hovering the countries in the map and start discovering what's going on around the world.</Paragraph>
                            <Paragraph className={styles.mobile}>Try clicking on the countries and start discovering what's going on around the world. Click again to open the article.</Paragraph>
                            <Paragraph>Unfortunately, no data is available for the dark-colored countries.</Paragraph>
                            <Paragraph>You can pick a language to have the texts translated.</Paragraph>
                        </div>
                    )}
                </Sider>

                <Layout.Content 
                    style={{ backgroundColor: 'var(--color-bg)' }}
                >
                    <motion.div
                        variants={mapVariants(oldRoute)}
                        className={styles.mapContainer}
                    >
                        <AnimatePresence>
                            {!mobileNoteHidden && (
                                <motion.div
                                    exit={{
                                        opacity: 0,
                                        transition: {
                                            duration: .3,
                                        }
                                    }}
                                    className={styles.mobileNote + ' ' + styles.mobile}
                                >
                                        <Card
                                            bodyStyle={{ 
                                                padding: '1.5rem' ,
                                                backgroundColor: 'var(--tooltip-color-bg)',
                                                color: 'var(--color-text)',
                                                border: 'none',
                                                transition: 'background-color var(--transition-theme-time), color var(--transition-theme-time)',
                                            }}
                                        >
                                            <a 
                                                className={styles.close}
                                                onClick={() => {
                                                    setMobileNoteHidden(true);
                                                    sessionStorage.setItem('mobileNoteHidden', 'true');
                                                }}
                                            >
                                                x
                                            </a>
                                            <Title style={{ letterSpacing: '1px', color: 'var(--color-text)' }} level={4}>Hi there!</Title>
                                            <Paragraph style={{ color: 'var(--color-text)' }}>Start exploring by zooming, dragging and clicking countries! Open the sider to select a language.</Paragraph>
                                        </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <WorldMap 
                            onTouchStart={onTouchStartHandler}
                            onMouseEnter={onMouseEnterHandler}
                            onCountryClicked={onClickHandler}
                            onMouseLeave={onMouseLeaveHandler}
                            onTouchEnd={onTouchEndHandler}
                            onBlur={onBlurHandler}
                            available={availableCountries}
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
                            className={styles.tooltip}
                            effect='float'
                        >
                            {tooltipContent}
                        </NewsTooltip>

                        <div className={styles.indicators}>
                            <Tooltip title='Drag the map' mouseEnterDelay={0.3} >
                                <DragIndicator />
                            </Tooltip>
                            <Tooltip title='Zoom using the mouse wheel' mouseEnterDelay={0.3} placement='topLeft'>
                                <ZoomIndicator className={styles.desktop} />
                            </Tooltip>
                            <Tooltip title='Pinch to zoom' mouseEnterDelay={0.3} placement='topLeft'>
                                <PinchIndicator className={styles.mobile} />
                            </Tooltip>
                        </div>

                    </motion.div>
                </Layout.Content>
            </motion.div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    // fetch data from firebase
    const cachedNews = await fbGetTopArticles(Object.keys(sourcesConfig.countryConfigs));

    // filter countries not returned by firebase
    const toFetch = Object.keys(sourcesConfig.countryConfigs).filter(k => !cachedNews[k]);

    // fetch non-cached data from news apis
    let newNews = await fetchTopStories(toFetch);

    // sort out countries for which no article was returned
    Object.keys(cachedNews).forEach(key => {
        if (!cachedNews[key].topArticle) {
            delete cachedNews[key];
        }
    });
    Object.keys(newNews).forEach(key => {
        if (!newNews[key].topArticle) {
            delete newNews[key];
        }
    });

    // if not all countries are returned by fetchTopStories (e.g. api limit reached for some reason)
    // refetch them from cache
    const unfetched = toFetch.filter(iso => !newNews[iso]);
    if (unfetched.length > 0) {
        const refetchedNews = await fbGetTopArticles(unfetched, true);
        newNews = {
            ...newNews,
            ...refetchedNews,
        };
    }

    // translate new data
    if (Object.keys(newNews).length > 0) {
        await translateToAll(newNews, TRANSLATE_TO);
    }

    // merge with cached data
    const news = {
        ...cachedNews,
        ...newNews,
    };

    // save new data to firebase
    await fbSaveTopArticles(newNews);

    // set available countries object
    const availableCountries = {};
    Object.keys(news).forEach(key => availableCountries[key] = true);

    // return props
    return {
        props: {
            news,
            availableCountries,
        },
    };
}