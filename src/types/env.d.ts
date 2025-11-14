declare global {
  interface Window {
    _env_: {
      REACT_APP_BASE_URL: string;
      REACT_APP_APP_MODE: string;
    };
  }
}

export {};

