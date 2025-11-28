// Initialize with default values if window._env_ is not defined
const defaultEnv = {
  REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL || "http://localhost:8008",
  REACT_APP_APP_MODE: process.env.REACT_APP_APP_MODE || "development",
};

// Check if running on Vercel (build time env vars available)
const isVercel = process.env.REACT_APP_ISVERCEL === "1";

const _env_ = isVercel
  ? defaultEnv // Use Vercel environment variables
  : (typeof window !== "undefined" && window._env_) || defaultEnv; // Use window._env_ for Docker
// const _env_ = (typeof window !== "undefined" && window._env_) || defaultEnv;

export const baseUrl = _env_.REACT_APP_BASE_URL;
export const appMode = _env_.REACT_APP_APP_MODE;

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

