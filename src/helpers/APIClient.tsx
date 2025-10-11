import { isArray, isEmpty, isNil, startsWith } from "lodash";
import querystring from "querystring";
import { baseUrl } from '../constants/environment';
import { logoutUser } from "../redux/actions";
const axios = require("axios");

const Qs = require("qs") ;

let Axios = axios.create({
  paramsSerializer: (params:any) => Qs.stringify(params, { arrayFormat: "repeat" }),
  // withCredentials: true,
});


class APIClient {

  _getBaseURL: string;
  _handleTokenExpired: any
  _token:any;
  _store:any;
  _deviceId:any;

  constructor() {
    this._getBaseURL = baseUrl;
  }

  /**
   * parse error to get message
   * @param error
   * @param defaultMessage default message
   */
   parseErrorMessage = ({ error, defaultMessage }:{error:any, defaultMessage:string}) => {
    if (
      !isNil(error) &&
      !isNil(error.response) &&
      !isNil(error.response.data) &&
      !isNil(error.response.data.error) &&
      !isNil(error.response.data.error.message)
    ) {
      return error.response.data.error.message;
    }
    return defaultMessage || "Có lỗi xảy ra, vui lòng thử lại sau";
  };

  /**
   * parse error to get status code
   * @param error
   * @param defaultStatusCode
   */
  parseErrorStatus = ({ error, defaultStatusCode = 404 }:{error:any, defaultStatusCode:number}) => {
    if (!isNil(error) && !isNil(error.response)) {
      return error.response.status;
    }
    return defaultStatusCode;
  };

  static isError = (response: any) => {
    if (response && response.response) {
      // we are checking response from network request
      response = response.response;
    }
    return !response || !response.data;
  };

  static isSucceed = (response: any) => {
    if (response && response.response) {
      // we are checking response from network request
      response = response.response;
    }
    return response && response.data;
  };

  /**
   * initialize
   */
  initialize = async (callback: ()=> any) => {
    if (callback) {
      callback();
    }
  };

  setTokenExpiredHandler = (handler:any) => {
    this._handleTokenExpired = handler;
  };
  
  GET = async (path:string, params?:object,header?:object, cancelToken?:any) => {
    return await this.request(
      "GET",
      path,
      header,
      null,
      params,
      null,
      cancelToken
    );
  };

  DOWNLOAD = async (path:string, params?:object,header?:object, cancelToken?:any) => {
    return await this.request(
      "GET",
      path,
      header,
      null,
      params,
      null,
      cancelToken,
      true
    );
  };

  DOWNLOADPOST = async (path:string, params?:object,header?:object, cancelToken?:any) => {
    return await this.request(
      "POST",
      path,
      header,
      null,
      params,
      null,
      cancelToken,
      true
    );
  };

  POST = async (path:string, data?:any, header?:object, cancelToken?:any) => {
    return await this.request(
      "POST",
      path,
      header,
      null,
      null,
      data,
      cancelToken
    );
  };

  PUT = async (path:string, data?:any, header?:object,cancelToken?:string) => {
    return await this.request("PUT", path, header, null, null, data, cancelToken);
  };

  DELETE = async (path:string, data?:any, header?:object, cancelToken?:string) => {
    return await this.request(
      "DELETE",
      path,
      header,
      null,
      null,
      data,
      cancelToken
    );
  };

  paramsPOST = async (path:string, params:object, data:any, cancelToken?:any) => {
    return await this.request(
      "POST",
      path,
      null,
      null,
      params,
      data,
      cancelToken
    );
  };

  jsonParamsPOST = async (path:string, params:object, data:any, cancelToken?:any) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    return await this.request(
      "post",
      path,
      headers,
      null,
      params,
      data,
      cancelToken
    );
  };

  jsonPOST = async (path:string, data:any, cancelToken?:any) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    return await this.request(
      "post",
      path,
      headers,
      null,
      null,
      data,
      cancelToken
    );
  };

  jsonPUT = async (path:string, data:any, cancelToken?:any) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    return await this.request(
      "put",
      path,
      headers,
      null,
      null,
      data,
      cancelToken
    );
  };

  jsonParamsPUT = async (path:string, params:object, data?:any, cancelToken?:any) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    return await this.request(
      "put",
      path,
      headers,
      null,
      params,
      data,
      cancelToken
    );
  };

  authPOST = async (path:string, auth:any, cancelToken?:any) => {
    return await this.request(
      "POST",
      path,
      null,
      auth,
      null,
      null,
      cancelToken
    );
  };

 

  request = async (method:string, path:string, headers?:any, auth?:any, params?:any, data?:any, cancelToken?:any, download?:boolean) => {
    try {
      let url;
      
      // params = this.genDataParamsApi(params)
      
      if (startsWith(path, "http")) {
        url = path;
      } else {
        url = this._getBaseURL + path;
      }

      if (isNil(params)) {
        params = {};
      }
      if (isNil(headers)) {
        headers = {};
      }
      
      headers["Accept"] = "application/json, text/plain, */*";
      if (!isEmpty(this._token) && isNil(headers["Authorization"])) {
        headers["Authorization"] = 'Bearer '+this._token;
        // headers["X-Openerp-Session-Id"] = this._token;
      }
      // console.log('type',data instanceof FormData);
      if (method === "GET") {
        // data = this.genDataParamsApi(data)
      } else if (!isNil(data)) {
        if (data instanceof FormData) {
          headers["Content-Type"] = "multipart/form-data";
          
        } else {
          // data = this.genDataParamsApi(data)
          const contentType = headers["Content-Type"];
          if (
            contentType === "application/x-www-form-urlencoded;charset=UTF-8" ||
            contentType === "application/x-www-form-urlencoded"
          ) {
            // post using x-www-form-urlencoded
            data = querystring.stringify(data);
          }else if(
            contentType === "text/plain" ||
            contentType === "text/plain;charset=UTF-8"
          ){
            download = true
            data = JSON.stringify(data);
          } else {
            // post using json
            headers["Content-Type"] = "application/json;charset=UTF-8";
            data = JSON.stringify(data);
          }
        }
      }
      // console.log("method: " + method);
      // console.log("headers: " + JSON.stringify(headers));
      // console.log("auth: ", JSON.stringify(auth));
      // console.log("path: " + path);
      // console.log("url: " + url);
      // console.log("params: " + JSON.stringify(params));
      // console.log("data: " + data);
      // console.log("cancel token: " + (cancelToken ? "not null" : "null"));
      console.log("axios: ",{
        url,
        method,
        headers,
        auth,
        params,
        data,
        cancelToken,
        responseType: download?'blob':'',
      });
      
      let rawResponse = await Axios({
        url,
        method,
        headers,
        auth,
        params,
        data,
        cancelToken,
        responseType: download?'blob':'',
      });
      
      // console.log("request url: ", rawResponse);
      const response = rawResponse.data;
      // console.log("request url: ", rawResponse);
      if(response?.error){
        console.log(`checkaaaaaaaaaaaaaaa`,response.error?.response)
        return {
          error: {
            error_description: response?.error?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại !",
            status : 400
          }
        };
      }
      return {
        response
      };
    } catch (error:any) {
      
      if(error?.response?.data?.statusCode === 401 && !["/account/logout", "/account/disable"].includes(window.location?.pathname )){
         window.location.href = "/account/logout"
         return {
          error: {
            error_description: "Phiên đăng nhập hết hạn",
            status :error.response.statuss
          }
        }
      }

      // console.log("API error: ", error.response, error.request, error.general);
      if (error.response) {
        // Request made and server responded
        console.log("API error: ", error.response.data, isArray(error.response.data?.message));
        // console.log(error.response.status);
        // console.log(error.response.headers);
        return {
          error: {
            error_description: isArray(error.response.data?.message) ? error.response.data?.message?.join(',') : error.response.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại !",
            status :error.response.status
          }
        }
      }
      //  else if (error.request) {
      //   // The request was made but no response was received
      //   // console.log('error.request',error.request);
      //   // 
      //   setTimeout(() =>{
      //     // window.location.href = '/account/login';
      //     console.log("logoutAPI", error);
          
      //     this._store.dispatch(logoutUser({}))
      //   },600)
      //   return {
      //     error:{
      //       error_description:"Đã có lỗi xảy ra, vui lòng thử lại !",
      //       status :500
      //     }
      //   }
      // } 
      else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
        return {
          error:{
            error_description:"Đã có lỗi xảy ra, vui lòng thử lại !",
            status :500
          }
        }
      }
    }
  };

  genDataParamsApi = (data:any)=>{
    const newData:any = {}
    data&&Object.keys(data).map(function(item,i) {
        if(!isNil(data[item]) && data[item] !== ""){
            newData[item] = data[item]
        }
    });
    return newData
  }

  getToken = () => this._token;

  setToken = (token:any) => (this._token = token);

  /**
   * update redux store
   * @param store
   */
  updateStore = (store:any) => {
    
    if (!store || this._store === store) {
      return;
    }
    this._store = store;
    const Auth = store.getState().Auth;
    this._token = Auth ? Auth.access_token : null;
    this._subscribeToken();
  };

  _handleStateChange = async () => {
    const Auth = this._store.getState().Auth;
    this._token = Auth ? Auth.access_token : null;
  };

  /**
   * subscribe for token change
   * @private
   */
  _subscribeToken = () => {
    if (!this._store) {
      return;
    }
    this._store.subscribe(this._handleStateChange);
  };
}

export default new APIClient();
