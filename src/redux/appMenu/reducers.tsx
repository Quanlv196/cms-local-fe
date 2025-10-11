// @flow
import {
    INIT_MENU,
    INIT_MENU_SUCCESS,
    CHANGE_ACTIVE_MENU_FROM_LOCATION,
    CHANGE_ACTIVE_MENU_FROM_LOCATION_SUCCESS,
} from './constants';
import { REHYDRATE, PERSIST } from 'redux-persist/lib/constants'; 


const AppMenu = (state = {}, action:any) => {
    switch (action.type) {
        case REHYDRATE:
            if(action?.payload?.Auth){
                return { 
                    ...state, 
                    loading: false, 
                    access_token:action?.payload?.Auth?.access_token,
                    user:action?.payload?.Auth?.user
                };
            }
            return { ...state, loading: false,};
        case INIT_MENU:
            return action.payload;
        case INIT_MENU_SUCCESS:
            return { ...state, ...action.payload };
        case CHANGE_ACTIVE_MENU_FROM_LOCATION:
            return { ...state };
        case CHANGE_ACTIVE_MENU_FROM_LOCATION_SUCCESS:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default AppMenu;
