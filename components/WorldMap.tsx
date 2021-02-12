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

interface WorldMapProps {
    available: Array<string>;
    setCountryHovered(content: CountryHoveredInfo | null): void;
    onCountryClicked(isoA2: string, countryName: string): void;
    zoom: number;
    coordinates: Point;
    onZoomEnd(props: any): void;
}
export default function WorldMap({ available, setCountryHovered, onCountryClicked, zoom, coordinates, onZoomEnd }: WorldMapProps) {
    
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
            >
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
                            onTouchStartCapture={() => {
                                if (available[geo.properties['ISO_A2']?.toLowerCase()]) {
                                    setCountryHovered({
                                        countryName: geo.properties['NAME'],
                                        isoA2: geo.properties['ISO_A2'].toLowerCase(),
                                    });
                                }
                            }}
                        />
                    ))}
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    )
}