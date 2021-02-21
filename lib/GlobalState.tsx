import { createGlobalState } from 'react-hooks-global-state';
import { Point } from 'react-simple-maps';
import { ShallowCountriesNews } from '../types';
import { isMobile } from '../utils/util';

interface GlobalState {
    siderCollapsed: boolean;
    clientRouted: boolean;
    mapZoomState: {
        coordinates: Point;
        zoom: number;
    };
    mobileNoteHidden: boolean;
    shallowNews: ShallowCountriesNews;
    countryColors: { [key: string]: string };
}
const initialState: GlobalState = {
    siderCollapsed: true,
    clientRouted: false,
    mapZoomState: {
        coordinates: [0, 0],
        zoom: isMobile() ? 2 : 1,
    },
    mobileNoteHidden: false,
    shallowNews: null,
    countryColors: {},
};
export default createGlobalState(initialState);