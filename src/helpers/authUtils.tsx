// @flow
import { Cookies } from 'react-cookie';

/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = () => {
    const access_token = getTokenUser();
    if (!access_token) {
        return false;
    }else{
        return true;
    }
};

/**
 * Returns the logged in user
 */
const getTokenUser = () => {
    const cookies:any = new Cookies();
    const access_token:any = cookies.get('access_token');
    console.log('API error: getTokenUser',cookies)
    return access_token ? access_token: null;
};

/**
 * Returns the logged in user
 */
const getLoggedInUser = () => {
    const cookies:any = new Cookies();
    const user:any = cookies.get('user');
    return user ? user: null;
};

export { isUserAuthenticated, getLoggedInUser, getTokenUser };
