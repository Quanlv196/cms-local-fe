// @flow
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import APIClient from "../../helpers/APIClient";

import {
  LOGIN_USER,
  LOGOUT_USER,
  GET_USER_DETAIL,
  LOGOUT_AND_REGISTER_USER,
} from "./constants";
import { baseUrl } from "../../constants/environment";

import {
  loginUserSuccess,
  loginUserSuccessToken,
  // registerUserSuccess,
  // registerUserFailed,
  // forgetPasswordSuccess,
  // forgetPasswordFailed,
  setToken,
} from "./actions";

let confirmResultPhone: any;

/**
 * Get expires by token
 * @param {*} token - token of user
 */
const getExpires = (token: string) => {
  const decoded: any = jwt_decode(token);
  return new Date(decoded?.exp * 1000);
};
/**
 * Sets the session
 * @param {*} name - name cookie
 * @param {*} cookie - cookie
 */
const setSession = (name: any, cookie: any) => {
  let date = new Date();
  let day = 7;
  date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
  let cookies = new Cookies();
  if (cookie) {
    // if(name === 'access_token'){
    //     //get expires by token
    //     date = getExpires(cookie)
    // }
    cookies.set(name, cookie, { path: "/", expires: date });
  } else {
    cookies.remove(name, { path: "/" });
  }
};
/**
 * Login the user
 * @param {*} payload - username and password
 */
function* login({ payload: { username, password } }: any): any {
  let roles: any = [];
  if (
    username?.validation_state === "cho_duyet" ||
    username?.validation_state === "tu_choi"
  ) {
    roles = [
      ...roles,
      ...[
        "profile_view",
        "profile_edit",
        "product_view",
        "order_view",
        "purchase_view",
        "picking_view",
        "inventory_view",
      ],
    ];
  } else if (username?.validation_state === "da_duyet") {
    roles = [
      ...roles,
      ...[
        "profile_view",
        "product_view",
        "product_add",
        "product_edit",
        "product_delete",
        "order_view",
        "order_add",
        "order_edit",
        "order_delete",
        "purchase_view",
        "purchase_add",
        "purchase_edit",
        "purchase_delete",
        "picking_view",
        "picking_add",
        "picking_edit",
        "picking_delete",
        "inventory_view",
        "inventory_add",
        "inventory_edit",
        "inventory_delete",
      ],
    ];
  }
  const userDetail = {
    ...username,
    id: username?.id || "",
    avatar: username?.image_128_url || "",
    name: username?.name || "",
    email: username?.email || "",
    phone: username?.phone || "",
    roles: roles,
  };
  console.log("userDetail", userDetail);
  const access_token = String(password);
  setSession("access_token", access_token);
  APIClient.setToken(access_token);
  yield put(loginUserSuccessToken(userDetail, access_token));
}

function* updateUser({ payload: user }: any): any {
  const userDetail = {
    ...user,
    id: user?.id || "",
    avatar: user?.image_128_url || "",
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    roles: [user?.role],
  };
  yield put(loginUserSuccess(userDetail));
}

/**
 * Get Info User
 * @param {*} param0
 */

function* getInffoUser(): any {
  const url = baseUrl;
  // let response:any = yield APIClient.GET(url,{},{
  //     // 'Ocp-Apim-Subscription-Key': subscriptionKey
  // });
  // if(response.error !== undefined){
  //     setSession('access_token',null);
  //     // setSession('user',null);
  //     yield put(setToken(null));
  //     yield put(loginUserFailed(response.error.error_description));
  // }else if (response.response !== undefined) {
  //     // const userDetail = response.response.data.user
  //     const userDetailRes = response.response
  //     const userDetail = {
  //         avatar:userDetailRes.avatar,
  //         name:userDetailRes.name,
  //         email:userDetailRes.email||'',
  //         phone:userDetailRes.phone||'',
  //     }
  //     // setSession('user',userDetail);
  //     yield put(loginUserSuccess(userDetail));
  // }
}
/**
 * Logout the user
 * @param {*} param0
 */
function* logout({ payload: { history } }: any): any {
  try {
    setSession("access_token", null);
    loginUserSuccess({});
    setToken(null);
    // APIClient.setToken(null)
    console.log("API error: logout");
    // setSession('user',null);
    // yield firebaseAuth.signOut().then(function() {
    //     // Sign-out successful.
    // }).catch(function(error) {
    //     // An error happened.
    // });

    yield call(() => {
      history.push("/account/login");
    });
  } catch (error) {}
}

function* logoutAndRegister({ payload: { history } }: any): any {
  try {
    setSession("access_token", null);
    loginUserSuccess({});
    setToken(null);
    // APIClient.setToken(null)

    yield call(() => {
      history.push("/account/register");
    });
  } catch (error) {}
}

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, login);
}

export function* watchGetUserDetail() {
  yield takeEvery(GET_USER_DETAIL, getInffoUser);
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

export function* watchLogoutAndRegisterUser() {
  yield takeEvery(LOGOUT_AND_REGISTER_USER, logoutAndRegister);
}

function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchGetUserDetail),
    fork(watchLogoutUser),
    fork(watchLogoutAndRegisterUser),
  ]);
}

export default authSaga;
