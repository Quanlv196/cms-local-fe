import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import moment from "moment";
import "moment/locale/vi"; // without this line it didn't work
import { PersistGate } from "redux-persist/integration/react";
import UserManager from "./manager/UserManager";
import CookieManager from "./manager/CookieManager";
moment.locale("vi");
let { store, persistor } = configureStore();
const Initial = async () => {
  UserManager.updateStore(store);
  // fix cookie
  if (CookieManager.getCookie("user")) {
    CookieManager.removeCookie("user");
  }
};
Initial();
ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <ToastContainer autoClose={3000} position={toast.POSITION.TOP_RIGHT} />
  </React.Fragment>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
