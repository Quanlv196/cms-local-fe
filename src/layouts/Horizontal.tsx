import React, { Component, Suspense, useState, useEffect } from "react";
import { Container } from 'reactstrap';
import { connect, ConnectedProps } from 'react-redux';

import { changeLayout } from '../redux/actions';
import * as layoutConstants from '../constants/layout';
// code splitting and lazy loading
// https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const Topbar = React.lazy(() => import("../components/Topbar"));
const Navbar = React.lazy(() => import("../components/Navbar"));
const Footer = React.lazy(() => import("../components/Footer"));
const loading = () => <div className="text-center"></div>;

interface RootState {
    Layout: {
        layoutType: string
    },
    Auth: {
        user: string
    }
}

const mapState = (state: RootState) => {
    return {
        layout: state.Layout,
        user: state.Auth.user,
    };
};

const connector = connect(mapState, { changeLayout })

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    children: Component
}

const HorizontalLayout: React.FC<Props> = (props: Props) => {
    const [isMenuOpened, setIsMenuOpened] = useState(false);
    const { children } = props || null;
    const openMenu = (e: Event) => {
        e.preventDefault();
        setIsMenuOpened(!isMenuOpened)
    }
    useEffect(() => {
        props.changeLayout(layoutConstants.LAYOUT_HORIZONTAL);
        return () => { };
    }, []);
    return (
        <React.Fragment>
            <div id="wrapper">
                <Suspense fallback={loading()}>
                    <Topbar openLeftMenuCallBack={openMenu} {...props} />
                </Suspense>
                <Suspense fallback={loading()}>
                    <Navbar isMenuOpened={isMenuOpened} {...props} />
                </Suspense>
                <div className="content-page">
                    <div className="content">
                        <Container fluid>
                            <Suspense fallback={loading()}>
                                {children}
                            </Suspense>
                        </Container>
                    </div>

                    {/* <Suspense fallback={loading()}>
                        <Footer />
                    </Suspense> */}
                </div>
            </div>
        </React.Fragment>
    )
}

export default connector(HorizontalLayout)