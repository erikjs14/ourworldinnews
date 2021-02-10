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
import { CountryNews } from './../types.d';
import { TOP_NEWS_TTL, TRANSLATE_TO } from '../config/consts';
import { translateToAll } from './../sourceFetching/translate';
import getMainLayout from './../layout/getMainLayout';
import BubbleContent from '../components/BubbleContent';
import Sider from '../components/Sider';
import useNewsLang from '../hooks/useNewsLang';

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

    const router = useRouter();

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
                timeoutRef = setTimeout(() => newsTooltipShown = true, 250);
            }
        } else {
            if (timeoutRef) clearTimeout(timeoutRef);
            timeoutRef = null;
            newsTooltipShown = false;
            setTooltipContent(null);
        }
    }

    const clickHandler = (isoA2: string, countryName: string) => {
        if (news[isoA2]) {
            // if touch-device -> open tooltip
            if (!('ontouchstart' in document.documentElement) || newsTooltipShown) {
                router.push({
                    pathname: `/top/${isoA2}`,
                    query: {
                        newsLang,
                    }
                });
            }            
        } 
    }

    return (
        <>
            <Head>
                <title>OurWorldInNews</title>
            </Head>

            <Sider
                newsLang={newsLang}
                setNewsLang={setNewsLang}
                initiallyCollapsed={false}
                showSiderFor={1000}
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
                <div className={styles.mapContainer}>
                    <WorldMap 
                        setCountryHovered={countryHoverHandler} 
                        available={availableCountries}
                        onCountryClicked={clickHandler}
                    />
                    <NewsTooltip
                        backgroundColor='#eee'
                        textColor='#000'
                        className={styles.tooltip}
                    >
                        {tooltipContent}
                    </NewsTooltip>
                    <Tooltip title='Drag the map' mouseEnterDelay={0.3} >
                        <DragIndicator className={styles.dragIndicator} />
                    </Tooltip>
                    <Tooltip title='Zoom using the mouse wheel' mouseEnterDelay={0.3} placement='topLeft'>
                        <ZoomIndicator className={styles.zoomIndicator} />
                    </Tooltip>
                </div>
            </Layout.Content>

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