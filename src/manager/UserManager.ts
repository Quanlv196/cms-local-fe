import jwtDecode from "jwt-decode";
import { findIndex, indexOf, isArray, isEmpty, isNil, reduce } from "lodash";
import { object } from "prop-types";
import { useHistory } from "react-router";
import { baseUrl } from "../constants/environment";
import APIClient from "../helpers/APIClient";
import { loginUserSuccess, logoutUser, setUserList } from "../redux/auth/actions";
class UserManager {
  _screenList: any;
  _token: any;
  _user: any;
  _csrf: any;
  _ctx: any;
  _store: any;
  _currentDevice: any;
  _productMethod: any;

  addScreen = (screen: any) => {
    // validate screen
    if (
      !screen ||
      (typeof screen.resetData !== "function" &&
        typeof screen.refreshData !== "function")
    ) {
      return;
    }

    const index = findIndex(this._screenList, screen);
    if (index >= 0) {
      // we already add this screen
      return;
    }

    this._screenList.push(screen);
  };
  removeScreen = (screen: any) => {
    if (!screen) {
      return;
    }

    const index = findIndex(this._screenList, screen);
    if (index < 0) {
      // we didn't add this screen
      return;
    }

    // remove screen
    this._screenList.splice(index, 1);
  };

  _resetScreenData = () => {
    this._screenList.forEach((screen: any) => {
      if (screen.resetData) {
        screen.resetData();
      }
    });
  };

  refreshScreensData = () => {
    if (!this._token) {
      return;
    }

    this._screenList.forEach((screen: any) => {
      if (screen.refreshData) {
        screen.refreshData();
      }
    });
  };

  getUserProperties = () => {
    const { properties, info } = this._user || {};
    return { ...(properties || {}), ...(info || {}) };
  };

  getUser = () => {
    if (!this._store) return null;
    const { user } = this._store.getState()

    return user;
  };


  getToken = () => this._token;

  getUserId = () => {
    if (
      isNil(this._user) ||
      isNil(this._user.info) ||
      isNil(this._user.info.id)
    ) {
      return 0;
    }

    return this._user.info.id;
  };

  getUserSlug = () => {
    if (isNil(this._user) || isNil(this._user.info)) {
      return null;
    }

    const { alias, id } = this._user.info;
    return alias || `${id}`;
  };

  /**
   * check if user is signed in
   */
  isSignedIn = () => {
    return !isEmpty(this._token);
  };

  /**
   * check if user is anonymous
   */
  isAnonymous = () => {
    if (
      this._user &&
      this._user.user &&
      this._user.user.providerName &&
      this._user.user.providerName === "anonymous"
    ) {
      return true;
    }
    return false;
  };

  /**
   * initialize with redux store
   * @param store
   */
  initialize = () => {
    this._screenList = [];
    // if (process.env.REACT_APP_PLATFORM === "web") {
    //   this._csrf = require("uuid").v4();
    // }
  };

  getCsrf = () => {
    return this._csrf;
  };



  /**
   * update redux store
   * @param store
   */
  updateStore = (store: any) => {
    if (!store || this._store === store) {
      return;
    }

    this._store = store;

    const user = store.getState().Auth.user;
    this._currentDevice = store.getState().device;
    this._user = user;
    if (this._store) {
      this._getUserInfo();
      // this._getUserList();
    }
    this._subscribeUser()
  };

  getStore = () => {
    return this._store;
  };

  _handleStateChange = () => {
    console.log('on handleChange store', this._store)
  };

  _subscribeUser = () => {
    this._store.subscribe(this._handleStateChange);
  };

  /**
   * fetch data of current user
   *
   * @private
   */

  delete_cookie = (name: string) => {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  _getUserInfo = async () => {
    if (!APIClient.getToken()) return;
    const user = this._store.getState().Auth.user;

    const url = '/auth/me';
    const { response } = await APIClient.GET(url);
    if (response) {
      const userDetail: any = {
        ...response,
      };
      let roles: any = []
      this._store.dispatch(loginUserSuccess(userDetail))

    } else {
      // this._store.dispatch(logoutUser({}))
    }
  };


  _updateUser = (user: object) => {
    if (user) {
      this._store.dispatch(loginUserSuccess(user))
    }

  }

  _updateUserConfig = async (config: { productMethod: any }) => {
    if (!config) {
      return;
    }

    return

    if (this.isSignedIn()) {
      console.log("update user config", config);
      const { response } = await APIClient.jsonPOST(
        "/user/config",
        config
      );
      if (response && response.data) {
        config = response.data;
      }
    }

    this._user = {
      ...this._user,
      config,
    };
    // this._store.dispatch(updateData(this._user));
    return { result: config.productMethod };
  };


}


export default new UserManager();