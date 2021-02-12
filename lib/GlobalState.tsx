import { createGlobalState } from 'react-hooks-global-state';

const initialState = {
    siderCollapsed: true,
    clientRouted: false,
};
export default createGlobalState(initialState);