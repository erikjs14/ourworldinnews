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
import { getIff, isMobile, randomBrightnessChange } from '../utils/util';
import { Touch, useEffect, useMemo, useState } from 'react';
import { COUNTRY_FILL_COLOR } from '../config/consts';
import globalState from '../lib/GlobalState' ;
const { useGlobalState } = globalState;

interface WorldMapProps {
    available: { [key: string]: any };
    onMouseEnter(content: CountryHoveredInfo | null): void;
    onMouseLeave(content: CountryHoveredInfo | null): void;
    onTouchStart(content: CountryHoveredInfo | null, touch: Touch): void;
    onTouchEnd(content: CountryHoveredInfo | null, touch: Touch): void;
    onBlur(content: CountryHoveredInfo | null): void;
    onCountryClicked(content: CountryHoveredInfo | null): void;
    zoom: number;
    coordinates: Point;
    onZoomEnd(props: any): void;
    loading: boolean;
}
export default function WorldMap({ available, onMouseEnter, onMouseLeave, onTouchStart, onTouchEnd, onCountryClicked, zoom, coordinates, onZoomEnd, onBlur, loading }: WorldMapProps) {

    const [slowFade, setSlowFade] = useState(true);
    useEffect(() => {
        if (!loading) setTimeout(() => setSlowFade(false), 2000);
    }, [loading]);

    const [countryCols, setCountryCols] = useGlobalState('countryColors');
    useEffect(() => {
        if (!countryCols || !Object.keys(countryCols).length) {
            const map = {};
            Object.keys(available).forEach(key => {
                map[key] = randomBrightnessChange(COUNTRY_FILL_COLOR[0], COUNTRY_FILL_COLOR[1], COUNTRY_FILL_COLOR[2], 20)
            });
            setCountryCols(map);
        }
    }, [available]);
    
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
                    {({ geographies }) => geographies.map(geo => {
                        const iso = geo.properties['ISO_A2']?.toLowerCase();
                        return (
                            geo.properties.ISO_A2 !== 'AQ' && (
                                <Geography 
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onMouseEnter={() => {
                                        if (available[iso]) {
                                            onMouseEnter({
                                                countryName: geo.properties['NAME'],
                                                isoA2: iso,
                                            });
                                        } else {
                                            onMouseEnter(null);
                                        }
                                    }}
                                    onClick={() => onCountryClicked({
                                        isoA2: iso, 
                                        countryName: geo.properties['NAME'],
                                    })}
                                    onMouseLeave={() => {
                                        onMouseLeave({
                                            countryName: geo.properties['NAME'],
                                            isoA2: iso,
                                        });
                                    }}
                                    className={
                                        styles.country 
                                        + getIff(available[iso], ` ${styles.available}`)
                                        + getIff(slowFade, ` ${styles.slowFade}`)
                                    }
                                    onTouchStartCapture={(event) => {
                                        if (available[iso]) {
                                            onTouchStart({
                                                countryName: geo.properties['NAME'],
                                                isoA2: iso,
                                            },
                                                event.touches[0]
                                            );
                                        } else {
                                            onTouchStart(null, event.touches[0]);
                                        }
                                    }}
                                    onTouchStart={(event) => {
                                        if (available[iso]) {
                                            onTouchStart({
                                                countryName: geo.properties['NAME'],
                                                isoA2: iso,
                                            },
                                                event.touches[0]
                                            );
                                        } else {
                                            onTouchStart(null, event.touches[0]);
                                        }
                                    }}
                                    onTouchEndCapture={(event) => {
                                        onTouchEnd({
                                            countryName: geo.properties['NAME'],
                                            isoA2: iso,
                                        },
                                            event.changedTouches[0]
                                        );
                                    }}
                                    onTouchEnd={(event) => {
                                        onTouchEnd({
                                            countryName: geo.properties['NAME'],
                                            isoA2: iso,
                                        },
                                            event.changedTouches[0]
                                        );
                                    }}
                                    onBlur={() => {
                                        onBlur({
                                            countryName: geo.properties['NAME'],
                                            isoA2: iso,
                                        });
                                    }}
                                    style={{
                                        default: {
                                            fill: countryCols[iso],
                                            transitionDelay: slowFade ? `${Math.random()}s` : undefined,
                                        },
                                    }}
                                />
                            ))
                        }
                    )}
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    )
}