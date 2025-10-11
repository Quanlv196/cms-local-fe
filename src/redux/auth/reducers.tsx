import { isEqual, isEmpty } from "lodash";
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
    SET_TOKEN,
    SET_PENDING,
    LOGIN_USER_BY_FIREBASE,
    LOGIN_USER_SENDED_OTP,
    UPDATE_BRANCH,
    GET_USER_LIST,
    // REHYDRATE
} from './constants';

import { getTokenUser, getLoggedInUser } from '../../helpers/authUtils';


import { REHYDRATE, PERSIST } from 'redux-persist/lib/constants'; 

const initialUser = ()=>{
    const Persist = localStorage.getItem("persist:root");
    const Auth = JSON.parse(Persist||"{}")?.Auth;
    const User =  JSON.parse(Auth || "{}")
    return User?.user
}
const INIT_STATE = {
    access_token: getTokenUser(),
    user:initialUser(),
    loading: false,
};

const Auth = (state = INIT_STATE, action:any) => {
    switch (action.type) {
        case REHYDRATE:
            if(action?.payload?.Auth){
                return { 
                    ...state, 
                    loading: false, 
                    access_token:action?.payload?.Auth?.access_token,
                    user:action?.payload?.Auth?.user
                };
            }
            return { ...state, loading: false,};
        case PERSIST:
            if(action?.payload?.Auth){
                return { 
                    ...state, 
                    loading: false, 
                    access_token:action?.payload?.Auth?.access_token,
                    user:action?.payload?.Auth?.user
                };
            }
            return { ...state, loading: false,};
        case LOGIN_USER:
            return { ...state, loading: true };
        case LOGIN_USER_BY_GOOGLE:
            return { ...state, loading: true };
        case LOGIN_USER_BY_FACEBOOK:
            return { ...state, loading: true };
        case LOGIN_USER_BY_FIREBASE:
            return { ...state, loading: true };
        case SET_TOKEN:
            return { ...state, access_token: action.payload};
        case LOGIN_USER_SUCCESS:
            if( !isEmpty(action.payload) && isEqual(state.user,action.payload)){
                return { ...state, loading: false, error: null };
            }
            console.log("reducer update user", action)
            return { ...state, user: action.payload, loading: false, error: null, sendedOTP:false, message:null  };
        case LOGIN_USER_SUCCESS_TOKEN:
            // if( !isEmpty(action.payload) && isEqual(state.user,action.payload.user)){
            //     return { ...state, loading: false, error: null };
            // }
            console.log("reducer update user", action)
            return { ...state, user: action.payload.user,access_token: action.payload.access_token, loading: false, error: null, sendedOTP:false, message:null  };
        case LOGIN_USER_FAILED:
            return { ...state, error: action.payload, loading: false, sendedOTP:false, message:null };
        case LOGIN_USER_SENDED_OTP:
            // return { ...state, error:null, message: action.payload, loading: false, sendedOTP:true};
            return { ...state, error:null, message: null, loading: false, sendedOTP:false, ...action.payload };
        case REGISTER_USER:
            return { ...state, loading: true };
        case REGISTER_USER_SUCCESS:
            return { ...state, user: action.payload, loading: false, error: null };
        case REGISTER_USER_FAILED:
            return { ...state, error: action.payload, loading: false };
        case LOGOUT_USER:
            return { ...state, user: null, access_token:null};
        case FORGET_PASSWORD:
            return { ...state, loading: true };
        case FORGET_PASSWORD_SUCCESS:
            return { ...state, passwordResetStatus: action.payload, loading: false, error: null };
        case FORGET_PASSWORD_FAILED:
            return { ...state, error: action.payload, loading: false };
        case SET_PENDING:
            return { ...state, pedding: action.payload};
        case UPDATE_BRANCH:
            return { ...state, user: {
                ...state?.user,
                branch_id: action.payload
            }};
        case GET_USER_LIST:
            return { ...state, user: {
                ...state?.user,
                userList: action.payload
            }};
        default:
            return { ...state };
    }
};

export default Auth;
