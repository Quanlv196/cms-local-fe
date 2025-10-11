import React, { Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { isMobileOnly } from "react-device-detect";
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import * as FeatherIcon from 'react-feather';

import AppMenu from './AppMenu';
import UserProfile from './UserProfile';

/**
 * Sidenav
 */

const SideNav = () => {
    return <div className="sidebar-content">
        <div id="sidebar-menu">
            <AppMenu />
        </div>
    </div>
}

interface RootState {
    isCondensed?:any,
    isLight:any
}

const LeftSidebar: React.FC<RootState> = (props:RootState)=>{
    let menuNodeRef:any;
    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e:Event) => {
        if (menuNodeRef&&menuNodeRef.contains(e.target)) return;
        // else hide the menubar
        if (document.body && isMobileOnly) {
            document.body.classList.remove('sidebar-enable');
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);
      }, []);
    const {isCondensed} = props || null
    return(
        <React.Fragment>
            <div className='left-side-menu' ref={node => menuNodeRef = node}>
                {/* <UserProfile /> */}
                <PerfectScrollbar><SideNav /></PerfectScrollbar>
                {/* {!isCondensed && <PerfectScrollbar><SideNav /></PerfectScrollbar>} */}
                {/* {isCondensed && <SideNav />} */}
            </div>
        </React.Fragment>
    )
}

export default connect()(LeftSidebar);
