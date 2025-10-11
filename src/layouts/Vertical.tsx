// @flow
import React, { Component, Suspense, useState, useEffect } from 'react';
import { Container } from 'reactstrap';
import { connect, ConnectedProps } from 'react-redux';

import { changeSidebarTheme, changeSidebarType } from '../redux/actions';
import * as layoutConstants from '../constants/layout';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router';

// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const LeftSidebar = React.lazy(() => import('../components/LeftSidebar'));
const Topbar = React.lazy(() => import('../components/Topbar'));
const Footer = React.lazy(() => import('../components/Footer'));

// loading
const emptyLoading = () => <div></div>;
const loading = () => <div className="text-center"></div>;

interface RootState {
    Layout: {
        layoutType: string
    },
    Auth: {
        access_token: string,
        user: any
    },
}

const mapState = (state: RootState) => {
    return {
        layout: state.Layout,
        access_token: state.Auth.access_token,
        user: state.Auth.user,
    };
};

const connector = connect(mapState, { changeSidebarTheme, changeSidebarType })

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    children: Component,
    layout: any
}

const VerticalLayout: React.FC<Props> = (props: Props) => {
    const { children, layout } = props || null;
    const { leftSideBarType, leftSideBarTheme } = layout;
    const isCondensed = leftSideBarType === layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED;
    const isLight = leftSideBarTheme === layoutConstants.LEFT_SIDEBAR_THEME_DEFAULT;

    const openLeftMenu = () => {
        if (document.body) {
            if (document.body.classList.contains("sidebar-enable")) {
                document.body.classList.remove("sidebar-enable");
                props.changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED);
            } else {
                if (document.body.classList.contains("left-side-menu-condensed"))
                    document.body.classList.remove("left-side-menu-condensed");
                document.body.classList.add("sidebar-enable");
            }
        }
    };

    useEffect(() => {
        if (window.innerWidth >= 768 && window.innerWidth <= 1028) {
            props.changeSidebarType(layoutConstants.LEFT_SIDEBAR_TYPE_CONDENSED);
        }
        return () => { };
    }, []);


    const { access_token, user } = props
    if (!access_token) {
        return (
            <Suspense fallback={loading()}>
                {children}
            </Suspense>
        );
    }

    console.log("propsxxx", props)

    return (
        <div className="app">
            <div id="wrapper">
                <Suspense fallback={emptyLoading()}>
                    <Topbar openLeftMenuCallBack={openLeftMenu} {...props} />
                </Suspense>
                <Suspense fallback={emptyLoading()}>
                    <LeftSidebar
                        isCondensed={isCondensed}
                        isLight={isLight}
                        {...props}
                    />
                </Suspense>
                <div className="content-page">
                    <div className="content" id="myContent" style={{ paddingTop: 20 }}>
                        <Suspense fallback={loading()}>
                            {children}
                        </Suspense>
                    </div>

                    {/* <Suspense fallback={emptyLoading()}>
                        <Footer {...props} />
                    </Suspense> */}
                </div>
            </div>
        </div>
    )
}

export default connector(VerticalLayout)
