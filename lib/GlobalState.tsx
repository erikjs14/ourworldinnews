import { createGlobalState } from 'react-hooks-global-state';
import { Point } from 'react-simple-maps';
import { isMobile } from '../utils/util';

interface GlobalState {
    siderCollapsed: boolean;
    clientRouted: boolean;
    mapZoomState: {
        coordinates: Point;
        zoom: number;
    };
    mobileNoteHidden: boolean;
}
const initialState: GlobalState = {
    siderCollapsed: true,
    clientRouted: false,
    mapZoomState: {
        coordinates: [0, 0],
        zoom: isMobile() ? 2 : 1,
    },
    mobileNoteHidden: false,
};
export default createGlobalState(initialState);