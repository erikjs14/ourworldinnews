import styles from '../styles/WorldMap.module.scss';
import {
    ComposableMap,
    Geographies,
    Geography,
} from 'react-simple-maps';

const geoUrl = 'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

export default function WorldMap({ setTooltipContent }) {
    return (
        <ComposableMap 
            data-tip='' 
            projectionConfig={{ scale: 100 }} 
            projection='geoMercator' 
            viewBox='0 0 800 450' 
            className={styles.world}
        >
            <Geographies geography={geoUrl}>
                {({ geographies }) => geographies.map(geo => geo.properties.ISO_A2 !== 'AQ' && (
                    <Geography 
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => {
                            setTooltipContent(geo.properties.NAME);
                        }}
                        onMouseLeave={() => {
                            setTooltipContent('');
                        }}
                        className={styles.country}
                    />
                ))}
            </Geographies>
        </ComposableMap>
    )
}