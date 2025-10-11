// @flow
import React, { Component, Suspense } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { isUserAuthenticated } from '../helpers/authUtils';
import * as layoutConstants from '../constants/layout';

// Lazy loading and code splitting -
// Derieved idea from https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const loading = () => <div></div>;

// All layouts/containers
const AuthLayout = React.lazy(() => import('../layouts/Auth'));
const VerticalLayout = React.lazy(() => import('../layouts/Vertical'));
const HorizontalLayout = React.lazy(() => import('../layouts/Horizontal'));


/**
 * Exports the component with layout wrapped to it
 * @param {} WrappedComponent
 */
const withLayout = (WrappedComponent:any) => {

    interface RootState {
        Layout:{
            layoutType:any,
            layoutCls:any
        }
    }
    
    const mapState = (state:RootState) => {
        return {
            layout: state.Layout,
        };
    };
    
    const connector = connect(mapState, null)
    
    type PropsFromRedux = ConnectedProps<typeof connector>
      
    type Props = PropsFromRedux & {}

    const HOC: React.FC<Props> = (props:Props)=>{
        /**
         * Returns the layout component based on different properties
         */
        const getLayout = () => {
            if (!isUserAuthenticated()) return AuthLayout;
            const {layout} = props
            const {layoutType} = layout
            let layoutCls:any = VerticalLayout;
            switch (layoutType) {
                case layoutConstants.LAYOUT_HORIZONTAL:
                    layoutCls = HorizontalLayout;
                    break;
                default:
                    layoutCls = VerticalLayout;
                    break;
            }
            return layoutCls;
        };

        const Layout = getLayout();
        return (
            <Suspense fallback={loading()}>
                <Layout {...props}>
                    <WrappedComponent {...props} />
                </Layout>
            </Suspense>
        );
    };
    return connector(HOC)
};

export default withLayout;
