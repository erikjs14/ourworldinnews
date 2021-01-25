import { useState } from 'react';
import Head from 'next/head'
import Tooltip from 'react-tooltip';

import styles from '../styles/Home.module.scss'

import WorldMap from '../components/WorldMap';
import { GetStaticProps } from 'next';
import { fetchTopStories } from '../sourceFetching/topStories';
import { CountriesNews } from '../types';

interface HomeProps {
    news: CountriesNews;
}
export default function Home({ news }: HomeProps) {

    const [tooltipContent, setTooltipContent] = useState('');

    return (
        <>
            <Head>
                <title>OurWorldInNews</title>
            </Head>

            <div className={styles.container}>
                <WorldMap setTooltipContent={setTooltipContent} news={news}/>
                <Tooltip
                    backgroundColor='var(--color-accent)'
                >
                    {tooltipContent}
                </Tooltip>
            </div>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    const news = await fetchTopStories();
    return {
        props: {
            news,
        },
    };
}