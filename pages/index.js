import { useState } from 'react';
import Head from 'next/head'
import Tooltip from 'react-tooltip';
import styles from '../styles/Home.module.scss'

import WorldMap from '../components/WorldMap';

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

export default function Home() {

    const [tooltipContent, setTooltipContent] = useState('');

    return (
        <>
            <Head>
                <title>OurWorldInNews</title>
            </Head>

            <div className={styles.container}>
                <WorldMap setTooltipContent={setTooltipContent}/>
                <Tooltip>{tooltipContent}</Tooltip>
            </div>
        </>
    )
}
