// @flow
import {
    CHANGE_LAYOUT,
    CHANGE_LAYOUT_WIDTH,
    CHANGE_SIDEBAR_THEME,
    CHANGE_SIDEBAR_TYPE,
    TOGGLE_RIGHT_SIDEBAR,
    SHOW_RIGHT_SIDEBAR,
    HIDE_RIGHT_SIDEBAR,
    CHANGE_COLUMN_SERVICE,
    CHANGE_COLUMN_EXAM,
} from './constants';


export const changeLayout = (layout:string) => ({
    type: CHANGE_LAYOUT,
    payload: layout,
});

export const changeLayoutWidth = (width:any) => ({
    type: CHANGE_LAYOUT_WIDTH,
    payload: width,
});

export const changeSidebarTheme = (theme:any) => ({
    type: CHANGE_SIDEBAR_THEME,
    payload: theme,
});

export const changeSidebarType = (sidebarType:any) => ({
    type: CHANGE_SIDEBAR_TYPE,
    payload: sidebarType,
});

export const toggleRightSidebar = () => ({
    type: TOGGLE_RIGHT_SIDEBAR,
    payload: null,
});

export const showRightSidebar = () => ({
    type: SHOW_RIGHT_SIDEBAR,
    payload: null,
});

export const hideRightSidebar = () => ({
    type: HIDE_RIGHT_SIDEBAR,
    payload: null,
});

export const changeColumnService = (config:any) => ({
    type: CHANGE_COLUMN_SERVICE,
    payload: config,
});

export const changeColumnExam = (config:any) => ({
    type: CHANGE_COLUMN_EXAM,
    payload: config,
});
