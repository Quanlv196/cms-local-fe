const appMode = process.env.REACT_APP_APP_MODE || "development";
let envBaseUrl: string = "http://localhost:8080";
switch (appMode) {
  case "development":
    envBaseUrl = process.env.REACT_BASE_URL_DEV || "http://localhost:8080";
    break;
  case "production":
    envBaseUrl = process.env.REACT_BASE_URL_PROD || "http://localhost:8080";
    break;
  default:
    break;
}
export const baseUrl = "http://192.168.1.109:8080";

export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "535258981652",
  appId: "1:535258981652:web:b620376ebd859d38a48e01",
  measurementId: "G-7316HLVKRN",
};

export const SOCKET_URL = `${baseUrl}`;
export const SOCKET_PATH = `/identity/socket`;
export const NoImage =
  "https://stgppdgigpvi.blob.core.windows.net/zapp-images/149071.png";
