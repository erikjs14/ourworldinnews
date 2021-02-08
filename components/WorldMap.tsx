import styles from '../styles/WorldMap.module.scss';
import worldGeography from '../geographies/world-110m.json';
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from 'react-simple-maps';
import { CountryHoveredInfo } from '../pages';
import { useEffect } from 'react';

interface WorldMapProps {
    available: Array<string>;
    setCountryHovered(content: CountryHoveredInfo | null): void;
    onCountryClicked(isoA2: string, countryName: string): void;
}
export default function WorldMap({ available, setCountryHovered, onCountryClicked }: WorldMapProps) {
    
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
                            onClick={() => onCountryClicked(geo.properties['ISO_A2']?.toLowerCase(), geo.properties['NAME'])}
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