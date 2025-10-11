// @flow
import {
    INIT_MENU,
    INIT_MENU_SUCCESS,
    CHANGE_ACTIVE_MENU_FROM_LOCATION,
    CHANGE_ACTIVE_MENU_FROM_LOCATION_SUCCESS,
} from './constants';

export const initMenu = () => ({
    type: INIT_MENU,
    payload: {},
});

export const initMenuSuccess = (menuItems:any) => ({
    type: INIT_MENU_SUCCESS,
    payload: { menuItems },
});

export const changeActiveMenuFromLocation = (pathname?:string) => ({
    type: CHANGE_ACTIVE_MENU_FROM_LOCATION,
    payload: {pathname},
});

export const changeActiveMenuFromLocationSuccess = (activatedMenuItemIds:any) => ({
    type: CHANGE_ACTIVE_MENU_FROM_LOCATION_SUCCESS,
    payload: { activatedMenuItemIds },
});
