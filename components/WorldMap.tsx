import styles from '../styles/WorldMap.module.scss';
import worldGeography from '../geographies/world-110m.json';
import {
    ComposableMap,
    Geographies,
    Geography,
} from 'react-simple-maps';
import { CountriesNews } from '../types';
import BubbleContent from './BubbleContent';
import { ReactNode } from 'react';

interface WorldMapProps {
    news: CountriesNews;
    setTooltipContent(content: ReactNode): void;
}
export default function WorldMap({ news, setTooltipContent }: WorldMapProps) {
    return (
        <ComposableMap 
            data-tip='' 
            projectionConfig={{ scale: 100 }} 
            projection='geoMercator' 
            viewBox='0 0 800 450' 
            className={styles.world}
        >
            <Geographies geography={worldGeography}>
                {({ geographies }) => geographies.map(geo => geo.properties.ISO_A2 !== 'AQ' && (
                    <Geography 
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                            if (news[geo.properties.ISO_A2.toLowerCase()]?.topArticle) {
                                setTooltipContent(
                                    <BubbleContent
                                        countryName={geo.properties.NAME}
                                        title={news[geo.properties.ISO_A2.toLowerCase()].topArticle.title}
                                    />
                                )
                            }
                        }}
                        onMouseLeave={() => {
                            setTooltipContent('');
                        }}
                        className={styles.country + (news[geo.properties.ISO_A2.toLowerCase()]?.topArticle ? ` ${styles.available}` : '')}
                    />
                ))}
            </Geographies>
        </ComposableMap>
    )
}