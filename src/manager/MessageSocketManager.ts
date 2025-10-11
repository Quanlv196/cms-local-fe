import {findIndex, isEmpty, uniq} from 'lodash';

export default new class MessageSocketManager {
  _listeners:any[]= [];
  _socket:any
  updateSocket = (socket:any) => {
    this._socket = socket;
    this._subscribe();
    console.log('MessageSocketManager update socket', this._socket)
  };

  removeSocket = () => {
    if (this._socket) {
      delete this._socket;
    }
  };

  addListener = (listener:any) => {
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
    this._socket.on('unreadConversations', this._handleUnreadConversation);
    this._socket.on('userReadConversation', this._handleUserReadConversation);
  };

 
  _handleUnreadConversation = (data:any) => {
    console.log('on unread:', data);

    for (let listener of this._listeners) {
      listener.onUpdateUnreadConversation(data);
    }
  };
  _handleUserReadConversation = (data:any) => {
    console.log('on user read:', data);

    for (let listener of this._listeners) {
      listener.onUpdateUserReadConversation(data);
    }
  };

  _handleMessage = (data:any) => {
    console.log('MessageSocket on update message', data)
    if (isEmpty(data)) {
      return;
    }
    
    for (let listener of this._listeners) {
      console.log('this._listeners', listener);
      if(listener?.onUpdateMessage){
        listener?.onUpdateMessage(data)
      }
    }
  };
  _handleConversations = (data:any) => {
    console.log('MessageSocket on update conversation', data)
    if (isEmpty(data)) {
      return;
    }
    for (let listener of this._listeners) {
      if(listener?.onUpdateConversation){
        listener?.onUpdateConversation(data)
      }
    }
  };
}();
