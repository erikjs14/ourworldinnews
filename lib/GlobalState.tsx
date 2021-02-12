import { createGlobalState } from 'react-hooks-global-state';
import { Point } from 'react-simple-maps';

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
        zoom: 1,
    },
    mobileNoteHidden: false,
};
export default createGlobalState(initialState);