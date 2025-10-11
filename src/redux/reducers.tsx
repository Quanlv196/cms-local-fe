// @flow

import { combineReducers } from 'redux';
import Layout from './layout/reducers';
import Auth from './auth/reducers';
import AppMenu from './appMenu/reducers';

const rootReducer = combineReducers({
    Auth,
    AppMenu,
    Layout,
});


export default rootReducer