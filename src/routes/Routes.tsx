import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Loadable from "react-loadable";
import { connect, ConnectedProps } from "react-redux";
import * as layoutConstants from "../constants/layout";
import { allFlattenRoutes as routes } from "./index";
import { CommonStatus } from "../enums/common.enum";
import DisabledAccount from "../pages/auth/DisabledAccount";

// Lazy loading and code splitting -
// Derieved idea from https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52
const loading = () => (
  <div>
    <div className="spinner-grow text-primary m-2" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

// All layouts/containers
const AuthLayout = Loadable({
  loader: () => import("../layouts/Auth"),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading,
});

const LockAccountLayout = Loadable({
  loader: () => import("../layouts/Auth"),
  render(loaded, props) {
    return <DisabledAccount />;
  },
  loading,
});

const VerticalLayout = Loadable({
  loader: () => import("../layouts/Vertical"),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading,
});

const HorizontalLayout = Loadable({
  loader: () => import("../layouts/Horizontal"),
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  },
  loading,
});

interface RootState {
  Layout: {
    layoutType: string;
  };
  Auth: {
    access_token: string;
    user: any;
  };
}

const mapState = (state: RootState) => {
  return {
    layout: state.Layout,
    access_token: state.Auth.access_token,
    user: state.Auth.user,
  };
};

const connector = connect(mapState, null);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {};

const Routes: React.FC<Props> = (props: any) => {
  const { access_token, user } = props;
  console.log("userxxxx", props);

  const getLayout = () => {
    if (!access_token) return AuthLayout;
    if (
      user?.status == CommonStatus.disable &&
      !["/account/logout", "/account/login"].includes(window.location.pathname)
    )
      return LockAccountLayout;
    const { layout } = props;
    const { layoutType } = layout;
    let layoutCls = VerticalLayout;
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
  console.log("routes", routes);

  return (
    <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASENAME || "/"}>
      <Layout {...props}>
        <Switch>
          {routes.map((route: any, index: number) => {
            return !route.children && route.component ? (
              <route.route
                key={index}
                path={route.pathParam ? route.pathParam : route.path}
                roles={route.roles}
                user={{ ...user }}
                access_token={access_token}
                exact={route.exact}
                component={route.component}
                // dataFromRouter={route.dataFromRouter}
                dataFromRouter={{
                  ...route.dataFromRouter,
                }}
              ></route.route>
            ) : null;
          })}
        </Switch>
      </Layout>
    </BrowserRouter>
  );
};

export default connector(Routes);
