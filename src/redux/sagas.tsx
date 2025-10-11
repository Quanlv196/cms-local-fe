// @flow
import { all, take } from 'redux-saga/effects';
import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import appMenuSaga from './appMenu/saga';
import { REHYDRATE } from 'redux-persist/lib/constants';

export default function* rootSaga(getState: any): any {
    // console.log("Waiting for rehydration")
    // yield take(REHYDRATE); // Wait for rehydrate to prevent sagas from running with empty store
    // console.log("Rehydrated")
    yield all([authSaga(), layoutSaga(), appMenuSaga()]);
}
