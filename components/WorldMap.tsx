import styles from '../styles/WorldMap.module.scss';
import worldGeography from '../geographies/world-110m.json';
import {
    ComposableMap,
    Geographies,
    Geography,
    Point,
    ZoomableGroup,
} from 'react-simple-maps';
import { CountryHoveredInfo } from '../pages';
import { isMobile } from '../utils/util';

interface WorldMapProps {
    available: { [key: string]: any };
    onMouseEnter(content: CountryHoveredInfo | null): void;
    onMouseLeave(content: CountryHoveredInfo | null): void;
    onTouchStart(content: CountryHoveredInfo | null): void;
    onTouchEnd(content: CountryHoveredInfo | null): void;
    onBlur(content: CountryHoveredInfo | null): void;
    onCountryClicked(content: CountryHoveredInfo | null): void;
    zoom: number;
    coordinates: Point;
    onZoomEnd(props: any): void;
}
export default function WorldMap({ available, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd, onCountryClicked, zoom, coordinates, onZoomEnd, onBlur }: WorldMapProps) {
    
    return (
        <ComposableMap 
            data-tip='' 
            projectionConfig={{ scale: 100 }} 
            projection='geoMercator' 
            viewBox='0 0 800 425' 
            className={styles.world}
        >
            <ZoomableGroup
                onMoveEnd={onZoomEnd}
                center={coordinates}
                zoom={zoom}
                maxZoom={isMobile() ? 50 : 30}
            >
                <Geographies geography={worldGeography}>
                    {({ geographies }) => geographies.map(geo => geo.properties.ISO_A2 !== 'AQ' && (
                        <Geography 
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => {
                                if (available[geo.properties['ISO_A2']?.toLowerCase()]) {
                                    onMouseEnter({
                                        countryName: geo.properties['NAME'],
                                        isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                    });
                                } else {
                                    onMouseEnter(null);
                                }
                            }}
                            onClick={() => onCountryClicked({
                                isoA2: geo.properties['ISO_A2']?.toLowerCase(), 
                                countryName: geo.properties['NAME'],
                            })}
                            onMouseLeave={() => {
                                onMouseLeave({
                                    countryName: geo.properties['NAME'],
                                    isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                });
                            }}
                            className={styles.country + (available[geo.properties['ISO_A2']?.toLowerCase()] ? ` ${styles.available}` : '')}
                            onTouchStartCapture={() => {
                                if (available[geo.properties['ISO_A2']?.toLowerCase()]) {
                                    onTouchStart({
                                        countryName: geo.properties['NAME'],
                                        isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                    });
                                } else {
                                    onTouchStart(null);
                                }
                            }}
                            onTouchStart={() => {
                                if (available[geo.properties['ISO_A2']?.toLowerCase()]) {
                                    onTouchStart({
                                        countryName: geo.properties['NAME'],
                                        isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                    });
                                } else {
                                    onTouchStart(null);
                                }
                            }}
                            onTouchEndCapture={() => {
                                onTouchEnd({
                                    countryName: geo.properties['NAME'],
                                    isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                });
                            }}
                            onTouchEnd={() => {
                                onTouchEnd({
                                    countryName: geo.properties['NAME'],
                                    isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                });
                            }}
                            onBlur={() => {
                                onBlur({
                                    countryName: geo.properties['NAME'],
                                    isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                });
                            }}
                        />
                    ))}
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    )
}