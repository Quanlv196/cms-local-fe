import React from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import * as FeatherIcon from "react-feather";

import { isUserAuthenticated } from "../helpers/authUtils";
import { startsWith } from "lodash";
import UserInfo from "../pages/auth/UserInfo";

// auth
const Login = React.lazy(() => import("../pages/auth/Login"));
const Logout = React.lazy(() => import("../pages/auth/Logout"));
// notFound
const NotFound = React.lazy(() => import("../pages/dashboard/NotFound"));

// Users
const UsersList = React.lazy(() => import("../pages/user/UsersList"));
const UsersAdd = React.lazy(() => import("../pages/user/UsersAdd"));
const UsersDetail = React.lazy(() => import("../pages/user/UsersDetail"));

//Battalion
const BattalionList = React.lazy(
  () => import("../pages/configs/battalion/BattalionList")
);

interface PrivateRouteProps extends RouteProps {
  component: any;
  roles: any;
  user: any;
  access_token: string;
  path: string;
  dataFromRouter?: any;
}

const PrivateRoute = (props: PrivateRouteProps) => {
  const {
    component: Component,
    roles,
    user,
    access_token,
    path,
    dataFromRouter,
    ...rest
  } = props;
  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (startsWith(path, "/iframes")) {
          return <Component {...props} dataFromRouter={dataFromRouter} />;
        }
        if (!isUserAuthenticated() || !access_token) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{
                pathname: "/account/login",
                state: { from: props.location },
              }}
            />
          );
        }
        return <Component {...props} dataFromRouter={dataFromRouter} />;
        // if (checkRole(user?.roles, roles)) {
        //   return <Component {...props} dataFromRouter={dataFromRouter} />;
        // } else {
        //   return <Redirect to={{ pathname: "/account" }} />;
        // }
        // const role = user?.roles?user?.roles[0]:'anonymous'
        // // check if route is restricted by role
        // // console.log('PrivateRoute',roles,role,user,access_token)
        // if (roles && roles.indexOf(role) === -1) {
        //     // role not authorised so redirect to home page
        //     return <Redirect to={{ pathname: '/account' }} />;
        // }

        // // authorised so return component
        // return <Component {...props} />;
      }}
    />
  );
};

// root routes
const rootRoute = {
  path: "/",
  exact: true,
  component: () => <UserInfo />,
  route: PrivateRoute,
};

// Auth
const authRoutes = {
  path: "/account",
  name: "Auth",
  children: [
    {
      path: "/account/login",
      name: "Login",
      component: Login,
      route: Route,
    },
    {
      path: "/account/logout",
      name: "Logout",
      component: Logout,
      route: Route,
    },
    {
      path: "/account",
      name: "Profile",
      component: UserInfo,
      route: PrivateRoute,
    },
  ],
};

const UsersRouter = {
  path: "/user",
  pathParam: "/user/list",
  name: "Quản lý tài khoản",
  icon: FeatherIcon.User,
  children: [
    {
      path: "/user/list",
      component: UsersList,
      route: PrivateRoute,
      hide: true,
    },
    {
      pathParam: "/user/:id/:action",
      component: UsersDetail,
      route: PrivateRoute,
      hide: true,
    },
    {
      pathParam: "/user/:id",
      component: UsersDetail,
      route: PrivateRoute,
      hide: true,
    },
  ],
};

const BattalionRouter = [
  {
    name: "Quản lý tiểu đoàn",
    path: "/battalion/list",
    component: BattalionList,
    route: PrivateRoute,
  },
];

const ConfigsRouter = {
  path: "/configs",
  pathParam: "/configs/list",
  name: "Cấu hình",
  icon: FeatherIcon.Settings,
  children: [...BattalionRouter],
};

// notFound
const notFoundRoute = {
  path: "*",
  exact: true,
  component: NotFound,
  route: PrivateRoute,
};

const appRoutes = [UsersRouter, ConfigsRouter];

// flatten the list of all nested routes
interface routesItem {
  children: any;
}

const flattenRoutes = (routes?: routesItem[]) => {
  let flatRoutes: any = [];

  routes = routes || [];
  routes.forEach((item) => {
    flatRoutes.push(item);
    if (typeof item.children !== "undefined") {
      flatRoutes = [...flatRoutes, ...flattenRoutes(item.children)];
    }
  });
  return flatRoutes;
};

// All routes
const allRoutes: any = [rootRoute, ...appRoutes, authRoutes, notFoundRoute];

const authProtectedRoutes = [...appRoutes];
// const authProtectedRoutes = [ ...appRoutes];
const allFlattenRoutes = flattenRoutes(allRoutes);
export { allRoutes, authProtectedRoutes, allFlattenRoutes };
