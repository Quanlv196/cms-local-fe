// @flow
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers';
import sagas from './sagas';
import APIClient from '../helpers/APIClient'
import { logger } from 'redux-logger';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware, logger];


const persistConfig = {
	key: 'root',
	storage
}

const persistedReducer = persistReducer(persistConfig, reducers)
declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
export function configureStore(initialState?:{}) {
    
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(persistedReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));
    
    // sagaMiddleware.run(sagas);
    sagaMiddleware.run(sagas,null);
    // 
    let persistor = persistStore(store)
    APIClient.updateStore(store)
    return {store, persistor};
}
