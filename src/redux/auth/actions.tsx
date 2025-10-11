// @flow
import {
    LOGIN_USER,
    LOGIN_USER_BY_GOOGLE,
    LOGIN_USER_BY_FACEBOOK,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_SUCCESS_TOKEN,
    LOGIN_USER_FAILED,
    LOGOUT_USER,
    REGISTER_USER,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAILED,
    FORGET_PASSWORD,
    FORGET_PASSWORD_SUCCESS,
    FORGET_PASSWORD_FAILED,
    GET_OTP,
    SET_TOKEN,
    GET_USER_DETAIL,
    LOGIN_USER_BY_FIREBASE,
    LOGIN_USER_SENDED_OTP,
    SET_PENDING,
    LOGOUT_AND_REGISTER_USER,
    UPDATE_BRANCH,
    GET_USER_LIST
} from './constants';

export const getUseDetail = () => ({
    type: GET_USER_DETAIL,
    payload: { },
});

export const getOTP = (phone:string) => ({
    type: GET_OTP,
    payload: { phone },
});

export const loginUser = (username:any, password:string) => ({
    type: LOGIN_USER,
    payload: { username, password },
});

export const loginUserByGoogle = (response:any) => ({
    type: LOGIN_USER_BY_GOOGLE,
    payload: { response },
});

export const loginUserByFacebook = (response:any) => ({
    type: LOGIN_USER_BY_FACEBOOK,
    payload: { response },
});

export const loginUserByFirebase = (provider:any,value?:any) => ({
    type: LOGIN_USER_BY_FIREBASE,
    payload: { provider, value },
});

export const setToken = (access_token:any) => ({
    type: SET_TOKEN,
    payload: access_token,
});

export const setPending = (pedding:boolean) => ({
    type: SET_PENDING,
    payload: pedding,
});

export const loginUserSuccess = (user:any) => ({
    type: LOGIN_USER_SUCCESS,
    payload: user,
});

export const loginUserSuccessToken = (user:any,access_token:any)=>({
    type: LOGIN_USER_SUCCESS_TOKEN,
    payload: { user,access_token },
});

export const loginUserOTP = (payload:any) => ({
    type: LOGIN_USER_SENDED_OTP,
    payload: payload,
});

export const loginUserFailed = (error:any) => ({
    type: LOGIN_USER_FAILED,
    payload: error,
});

export const registerUser = (fullname:string, email:string, password:string) => ({
    type: REGISTER_USER,
    payload: { fullname, email, password },
});

export const registerUserSuccess = (user:any) => ({
    type: REGISTER_USER_SUCCESS,
    payload: user,
});

export const registerUserFailed = (error:any) => ({
    type: REGISTER_USER_FAILED,
    payload: error,
});

export const logoutUser = (history:any) => ({
    type: LOGOUT_USER,
    payload: { history },
});

export const logoutAndRegister = (history:any) => ({
    type: LOGOUT_AND_REGISTER_USER,
    payload: { history },
});

export const forgetPassword = (username:string) => ({
    type: FORGET_PASSWORD,
    payload: { username },
});

export const forgetPasswordSuccess = (passwordResetStatus:string) => ({
    type: FORGET_PASSWORD_SUCCESS,
    payload: passwordResetStatus,
});

export const forgetPasswordFailed = (error:string) => ({
    type: FORGET_PASSWORD_FAILED,
    payload: error,
});

export const setBranch = (branch:string) => ({
    type: UPDATE_BRANCH,
    payload: branch,
});

export const setUserList = (userList:any) => ({
    type: GET_USER_LIST,
    payload: userList,
});
