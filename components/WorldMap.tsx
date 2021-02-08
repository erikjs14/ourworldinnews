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
import { CountryHoveredInfo } from '../pages';

interface WorldMapProps {
    available: Array<string>;
    setCountryHovered(content: CountryHoveredInfo | null): void;
}
export default function WorldMap({ available, setCountryHovered }: WorldMapProps) {
    
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
                                if (available[geo.properties['ISO_A2']?.toLowerCase()]) {
                                    setCountryHovered({
                                        countryName: geo.properties['NAME'],
                                        isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                    });
                                }
                            }}
                            onMouseLeave={() => {
                                setCountryHovered(null);
                            }}
                            className={styles.country + (available[geo.properties['ISO_A2']?.toLowerCase()] ? ` ${styles.available}` : '')}
                        />
                    ))}
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    )
}