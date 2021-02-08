import { useEffect, useState } from 'react';
import { Layout, Tooltip } from 'antd';
import Link from 'next/link';
import moment from 'moment';
import Head from 'next/head'
import NewsTooltip from 'react-tooltip';
import DragIndicator from '../assets/drag-indicator.svg';
import ZoomIndicator from '../assets/zoom-indicator.svg';

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
import BubbleContent from '../components/BubbleContent';

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

    const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);
    const [newsLang, setNewsLang] = useState(DONT_TRANSLATE_VAL);
    const [siderCollapsed, setSiderCollapsed] = useState(false);

    // if small screen, show sider briefly, then hide
    useEffect(() => {
        setTimeout(() => setSiderCollapsed(window.matchMedia('(max-width: 768px)').matches), 1000);
    }, []);

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
                window.open(news[isoA2].topArticle.originalSourceLink, '_blank');
            }            
        } 
    }

    return (
        <>
            <Head>
                <title>OurWorldInNews</title>
            </Head>

            <Layout.Sider 
                width={300}
                className={styles.leftAside}
                collapsedWidth={0}
                collapsible
                collapsed={siderCollapsed}
                onCollapse={(collapsed) => setSiderCollapsed(collapsed)}
                zeroWidthTriggerStyle={{
                    backgroundColor: 'var(--color-primary)',
                }}
            >
                <div className={styles.wrapper}>

                {/* Mobile Menu */}
                <nav>
                    <a onClick={() => setSiderCollapsed(true)}>Home</a>
                    <Link href='/about'>
                        <a>About</a>
                    </Link>
                </nav>

                <div className={styles.intro + (siderCollapsed ? ' '+styles.hidden : '')}>
                    <h3>Hello there!</h3>
                    <p>Try hovering the countries in the map and start discovering what's going on around the world.</p>
                    <p>You can pick a language to have the texts translated.</p>
                </div>

                <LangPicker
                    className={styles.langCard + (siderCollapsed ? ' '+styles.hidden : '')}
                    langs={TRANSLATE_TO.map(iso => ({
                        value: iso,
                        label: iso.toUpperCase(),
                    }))}
                    value={newsLang}
                    onChange={setNewsLang}
                />
                </div>
            </Layout.Sider>
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
Home.Layout = getMainLayout('home', false);

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
    }

    const availableCountries = {};
    Object.keys(news).forEach(key => availableCountries[key] = true);

    // fs.writeFileSync('news.json', JSON.stringify(news));

    return {
        props: {
            news,
            availableCountries,
        },
        revalidate: 60 * 60 * 24, // once a day
    };
}