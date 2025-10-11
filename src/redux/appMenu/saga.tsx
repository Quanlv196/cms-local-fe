// @flow
import { all, call, put, fork, takeEvery } from 'redux-saga/effects';

import { INIT_MENU, CHANGE_ACTIVE_MENU_FROM_LOCATION } from './constants';
import { authProtectedRoutes as routes } from '../../routes';
import assignIds from './utils';
import { initMenuSuccess, changeActiveMenuFromLocationSuccess } from './actions';

/**
 * Activate menu items from location
 * @param {*} menuItems
 */
interface menuItems{
    id:number,
    children:any,
    path:string,
}
const getActivatedMenuItemIds = (menuItems:menuItems[],pathname?:string) => {
    var matchingItems:any= [];
    if(!pathname){
        pathname = window.location.pathname
    }
    pathname = pathname.replace('/admin', '')
    for (var menuItem of menuItems) {
        if (pathname.indexOf(menuItem.path) === 0) {
            matchingItems.push(menuItem.id);
        }

        if (typeof menuItem.children !== 'undefined') {
            matchingItems = [...matchingItems, ...getActivatedMenuItemIds(menuItem.children, pathname)];
        }
    }
    return matchingItems;
};

/**
 * Initilizes the menu
 */
function* initMenuAndItems():any {
    try {
        const menuItems = assignIds(routes);
        const activatedMenuItemIds = yield call(getActivatedMenuItemIds, menuItems);
        yield put(initMenuSuccess(menuItems));
        yield put(changeActiveMenuFromLocationSuccess(activatedMenuItemIds));
    } catch (error) {}
}

/**
 * change the active menu item based on location
 */
function* changeActiveMenuFromLocation(action:any):any {
    const {payload} = action
    let {pathname} = payload
    if(!pathname){
        pathname = window.location.pathname
    }
    try {
        const menuItems = assignIds(routes);
        const activatedMenuItemIds = yield call(getActivatedMenuItemIds, menuItems, pathname);
        yield put(changeActiveMenuFromLocationSuccess(activatedMenuItemIds));
    } catch (error) {}
}

/**
 * Watchers
 */
export function* watchMenuInit() {
    yield takeEvery(INIT_MENU, initMenuAndItems);
}

export function* watchMenuChange() {
    yield takeEvery(CHANGE_ACTIVE_MENU_FROM_LOCATION, changeActiveMenuFromLocation);
}

function* appMenuSaga() {
    yield all([fork(watchMenuInit), fork(watchMenuChange)]);
}

export default appMenuSaga;
