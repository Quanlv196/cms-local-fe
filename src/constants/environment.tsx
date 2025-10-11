let envBaseUrl: string = "https://dev.node.f99.com.vn/api";
switch (process.env.REACT_APP_APP_MODE) {
  case "development":
    envBaseUrl = "http://localhost:8008";
    break;
  case "production":
    envBaseUrl = "http://localhost:8008";
    break;
  default:
    break;
}
export const baseUrl = envBaseUrl;

export const firebaseConfig = {
  apiKey: "AIzaSyDQOjibMhstB77NcYwVc2Ubs8pnKFNLNjw",
  authDomain: "zs-bilet.firebaseapp.com",
  projectId: "zs-bilet",
  storageBucket: "zs-bilet.appspot.com",
  messagingSenderId: "535258981652",
  appId: "1:535258981652:web:b620376ebd859d38a48e01",
  measurementId: "G-7316HLVKRN",
};

export const SOCKET_URL = `${baseUrl}`;
export const SOCKET_PATH = `/identity/socket`;
export const NoImage =
  "https://stgppdgigpvi.blob.core.windows.net/zapp-images/149071.png";
