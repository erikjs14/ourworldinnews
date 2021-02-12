import worldGeography from '../geographies/world-110m.json';
import {
    ComposableMap,
    Geographies,
    Geography,
    Annotation,
    Point,
} from 'react-simple-maps';
import countryCoords from '../geographies/countryCoordinates.json';
import styles from '../styles/MiniMap.module.scss';


interface MiniMapProps {
    highlightCountry?: string;
}

export default function MiniMap({ highlightCountry }: MiniMapProps) {

    const highlightCoords = highlightCountry && countryCoords.find(cc => cc.country_code.toLowerCase() === highlightCountry);

    return (
        <ComposableMap
            projectionConfig={{ scale: 200, center: highlightCoords?.latlng?.slice().reverse() as Point || undefined }} 
            projection='geoMercator' 
            viewBox='0 0 800 425'
            className={styles.world}
        >
            <Geographies geography={worldGeography}>
                {({ geographies }) => geographies.map(geo => geo.properties.ISO_A2 !== 'AQ' && (
                    <Geography 
                        key={geo.rsmKey}
                        geography={geo}
                        className={styles.country + (highlightCountry && highlightCountry.toLowerCase() === geo.properties.ISO_A2.toLowerCase() ? ' '+styles.highlight : '')}
                    />
                ))}
            </Geographies>
            { highlightCoords && (
                <Annotation
                    subject={highlightCoords.latlng.slice().reverse() as Point}
                    curve={0.5}
                    dx={-90}
                    dy={-60}
                    connectorProps={{
                        stroke: "var(--color-accent)",
                        strokeWidth: 6,
                        strokeLinecap: "round"
                    }}
                >
                    <text x="-8" textAnchor="end" alignmentBaseline="middle" fill="var(--color-accent)">
                        {highlightCoords.name}
                    </text>
                </Annotation>
            )}
        </ComposableMap>
    )
}