import { findIndex, isEmpty, uniq } from 'lodash';

export default new class MessageManager {
  _listeners: any[] = [];
  _socket: any
  updateSocket = (socket: any) => {
    this._socket = socket;
    this._subscribe();
    console.log('MessageManager update socket', this._socket)
  };

  removeSocket = () => {
    if (this._socket) {
      delete this._socket;
    }
  };

  addListener = (listener: any) => {
    // validate component
    if (!listener) {
      return;
    }
    const index = findIndex(this._listeners, listener);
    if (index >= 0) {
      // we already add that component
      return;
    }

    this._listeners.push(listener);
    this._listeners = uniq(this._listeners);
  };

  removeListener = (listener: any) => {
    if (!listener) {
      return;
    }

    const index = findIndex(this._listeners, listener);
    console.log('removeListener', this._listeners, listener, index);
    if (index < 0) {
      // we didn't add that component
      return;
    }
    // remove component
    this._listeners.splice(index, 1);
  };

  _subscribe = () => {
    if (!this._socket) {
      return;
    }
    this._socket.on('message', this._handleMessage);
    this._socket.on('conversation', this._handleConversations);
    this._socket.on('paymentTransactionUpdateStatus', this._handleUpdatePaymentStatus);
  };

  _handleMessage = (data: any) => {
    console.log('on message:', data);

    if (isEmpty(data)) {
      return;
    }
    // console.log('this._listeners', this._listeners);
    for (let listener of this._listeners) {
      listener.onUpdateMessage(data);
    }
  };
  _handleConversations = (data: any) => {
    console.log('on conversation:', data);

    if (isEmpty(data)) {
      return;
    }
    // console.log('this._listeners', this._listeners);
    for (let listener of this._listeners) {
      listener.onUpdateConversation(data);
    }
  };
  _handleUpdatePaymentStatus = (data: any) => {
    console.log('on paymentTransactionUpdateStatus:', data);

    if (isEmpty(data)) {
      return;
    }
    console.log('this._listeners', this._listeners);
    for (let listener of this._listeners) {
      listener.onUpdatePaymentStatus(data);
    }
  };
}();
