import io from 'socket.io-client';
import { findIndex, isEmpty, uniq } from 'lodash';
import MessageManager from './MessageManager';
import { Store } from 'redux';
import FirebaseManager from './FirebaseManager';
import { baseUrl } from '../constants/environment';

export interface RoomEntity {
  entity: string;
  entityId: string;
}

export default new (class SocketManager {
  private _store: any;
  private _socket: any;
  private _token?: string | null;
  private _connected = false;
  private _listeners: any[] = [];

  static getBaseURL = () => {
    return baseUrl
  };

  initialize = () => { };


  updateStore = (store: any) => {
    // return
    if (store) {
      const user = store.getState().Auth;
      this._token = user ? user.access_token : null;
    } else {
      this._token = null;
    }
    console.log('socket authenticate token: ', this._token);
    if (this._store !== store) {
      this._store = store;
      this._subscribeToken();
    }
    this._connect();
  };

  signOut = () => {
    this._closeSocket();
  };

  _connect = () => {
    this._closeSocket();
    if (!this._token) return
    const url = SocketManager.getBaseURL();
    const options: any = {
      // extraHeaders:{
      //   Authorization: `Bearer ${this._token}`,
      // },
      auth: {
        token: this._token,
      },
      // jsonp: false,
      secure: true,
      transports: ['websocket'],
    };
    console.log('socket url:', url);
    console.log('socket options:', options);
    const socket = io(url, options);
    socket.on('connect', () => {
      this._connected = true;
      this._updateSocket(socket);
      this._onSocket(socket);
      // if (!isEmpty(this._token)) {
      //   socket.emit(
      //     'cms/authenticate',
      //     {
      //       token: FirebaseManager.getToken(),
      //     },
      //     () => {
      //       console.log('socket ack received with token: '+FirebaseManager.getToken());
      //     },
      //   );
      // }
    });
    socket.on('disconnect', () => {
      console.log('on socket disconnect');
      this._connected = false;
    });
    socket.on('connect_error', (error: any) => {
      console.log('on socket connect error:', error);
      this._connected = false;
      // this._connect();
    });
    socket.on('connect_timeout', () => {
      console.log('on socket connect timeout');
      this._connected = false;
    });
  };

  _updateSocket = (socket: any) => {
    console.log('update socket', socket);
    this._socket = socket;
    MessageManager.updateSocket(socket);
  };

  _closeSocket = () => {
    if (!this._socket) {
      return;
    }

    console.log('close socket');
    this._socket.close();
    delete this._socket;
    this._connected = false;
    MessageManager.removeSocket();
  };

  _handleStateChange = () => {
    const user = this._store.getState().Auth;
    const token = user && user.access_token ? user.access_token : null;
    if (this._token === token) {
      return;
    }

    console.log('socket manager update token: ', token);
    this._token = token;
    this._connect();
  };

  /**
   * subscribe for token change
   * @private
   */
  _subscribeToken = () => {
    this._store.subscribe(this._handleStateChange);
  };

  addListener = (listener: any) => {
    if (!listener || typeof listener.onUpdateSocket !== 'function') return;

    const index = findIndex(this._listeners, listener);
    if (index >= 0) return;

    this._listeners.push(listener);
    this._listeners = uniq(this._listeners);
  };

  removeListener = (listener: any) => {
    if (!listener) return;
    const index = findIndex(this._listeners, listener);
    if (index < 0) return;

    this._listeners.splice(index, 1);
  };

  _onSocket = (socket: any) => {
    if (isEmpty(socket) || !socket.connected || isEmpty(this._listeners))
      return;

    for (let listener of this._listeners) {
      listener.onUpdateSocket(socket);
    }
  };
})();
