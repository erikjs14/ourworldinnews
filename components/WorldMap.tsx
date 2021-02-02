import styles from '../styles/WorldMap.module.scss';
import worldGeography from '../geographies/world-110m.json';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';
import { CountriesNews } from '../types';
import BubbleContent from './BubbleContent';
import { ReactNode } from 'react';

interface WorldMapProps {
    news: CountriesNews;
    setTooltipContent(content: ReactNode): void;
    translateTo: string;
}
export default function WorldMap({ news, setTooltipContent, translateTo }: WorldMapProps) {
    
    return (
        <ComposableMap 
            data-tip='' 
            projectionConfig={{ scale: 100 }} 
            projection='geoMercator' 
            viewBox='0 0 800 425' 
            className={styles.world}
        >
            <ZoomableGroup zoom={1}>
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
                                            title={
                                                news[geo.properties.ISO_A2.toLowerCase()].topArticle.titleTranslated[translateTo] 
                                                || news[geo.properties.ISO_A2.toLowerCase()].topArticle.title
                                            }
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
            </ZoomableGroup>
        </ComposableMap>
    )
}