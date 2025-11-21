import React, { useEffect } from "react";
import { connect } from "react-redux";

import { isMobileOnly } from "react-device-detect";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Banner from "../assets/images/app-local/banner_app.jpg";

import AppMenu from "./AppMenu";

/**
 * Sidenav
 */

const SideNav = () => {
  return (
    <div className="sidebar-content">
      <div
        id="sidebar-menu"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <AppMenu />
        <img src={Banner} alt="banner" />
      </div>
    </div>
  );
};

interface RootState {
  isCondensed?: any;
  isLight: any;
}

const LeftSidebar: React.FC<RootState> = (props: RootState) => {
  let menuNodeRef: any;
  /**
   * Handle the click anywhere in doc
   */
  const handleOtherClick = (e: Event) => {
    if (menuNodeRef && menuNodeRef.contains(e.target)) return;
    // else hide the menubar
    if (document.body && isMobileOnly) {
      document.body.classList.remove("sidebar-enable");
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOtherClick, false);
  }, []);
  const { isCondensed } = props || null;
  return (
    <React.Fragment>
      <div className="left-side-menu" ref={(node) => (menuNodeRef = node)}>
        {/* <UserProfile /> */}
        <PerfectScrollbar>
          <SideNav />
        </PerfectScrollbar>
        {/* {!isCondensed && <PerfectScrollbar><SideNav /></PerfectScrollbar>} */}
        {/* {isCondensed && <SideNav />} */}
      </div>
    </React.Fragment>
  );
};

export default connect()(LeftSidebar);

