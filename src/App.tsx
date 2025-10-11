import React from "react";
import Routes from "./routes/Routes";

// default theme
import "react-loading-skeleton/dist/skeleton.css";
import "./assets/scss/theme.scss";
import "antd/dist/antd.min.css";
import "suneditor/dist/css/suneditor.min.css";
function App() {
  return <Routes />;
}

export default App;
