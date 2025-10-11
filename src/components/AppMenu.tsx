import React, { FC, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import classNames from "classnames";
import ModalPopup from "./ModalPopup";
import { Col, CardBody, Button, FormGroup } from "reactstrap";
import {
  initMenu,
  changeActiveMenuFromLocation,
  setPending,
} from "../redux/actions";
type IconType = FC<any>;
const MenuItemWithChildren = ({
  role,
  roleType,
  access_token,
  changeActiveMenuFromLocation,
  item,
  linkClassNames,
  subMenuClassNames,
  activatedMenuItemIds,
}: any) => {
  const Icon = item?.icon || null;
  const [activeMenu, setActiveMenu] = useState(
    activatedMenuItemIds.indexOf(item.id) >= 0 ? true : false
  );
  const [childrenItem, setChildrenItem] = useState(item.children);
  const toggleClass = () => {
    setActiveMenu(!activeMenu);
    if (activeMenu) {
      changeActiveMenuFromLocation && changeActiveMenuFromLocation("/");
    }
  };

  console.log("activatedMenuItemIds", activatedMenuItemIds, item);
  useEffect(() => {
    setActiveMenu(activatedMenuItemIds.indexOf(item.id) >= 0 ? true : false);
    //set lại các child menu
    getChildMenu();
  }, [activatedMenuItemIds]);

  const getChildMenu = () => {
    const children: any[] = [];
    item.children.map((child: any) => {
      if (!child.hide) {
        children.push(child);
      }
    });
    setChildrenItem(children);
  };

  useEffect(() => {
    if (activeMenu) {
      changeActiveMenuFromLocation && changeActiveMenuFromLocation(item.path);
    }
  }, [activeMenu]);

  if (childrenItem.length === 0) {
    return (
      <li
        className={classNames("side-nav-item", {
          "mm-active": activatedMenuItemIds.indexOf(item.id) >= 0,
        })}
      >
        <Link
          to={item.pathParam}
          onClick={() => toggleClass()}
          className={classNames("side-sub-nav-link", linkClassNames || "")}
          aria-expanded={activatedMenuItemIds.indexOf(item.id) >= 0}
        >
          {item?.icon && <Icon />}
          {item?.badge && (
            <span className={`badge badge-${item.badge.variant} float-right`}>
              {item.badge.text}
            </span>
          )}
          <span> {item.name} </span>
        </Link>
      </li>
    );
  }
  let childrenItemCheckRole = 0;
  if (childrenItem.length === childrenItemCheckRole) {
    return null;
  }

  return (
    <li
      className={classNames("side-nav-item", {
        "mm-active": activatedMenuItemIds.indexOf(item.id) >= 0,
      })}
    >
      <a
        // to={item.path}
        onClick={() => toggleClass()}
        className={classNames("side-sub-nav-link", linkClassNames)}
        aria-expanded={activatedMenuItemIds.indexOf(item.id) >= 0}
      >
        {item?.icon && <Icon />}
        {item?.badge && (
          <span className={`badge badge-${item.badge.variant} float-right`}>
            {item.badge.text}
          </span>
        )}
        <span> {item.name} </span>
        <span className="menu-arrow"></span>
      </a>

      <ul
        className={classNames(subMenuClassNames, "mm-collapse", {
          "mm-collapsed mm-show": activatedMenuItemIds.indexOf(item.id) >= 0,
        })}
        aria-expanded={activatedMenuItemIds.indexOf(item.id) >= 0}
      >
        {childrenItem.map((child: any, i: number) => {
          if (child.hide) {
            return null;
          }
          return (
            <React.Fragment key={i}>
              {child.children ? (
                <MenuItemWithChildren
                  role={role}
                  roleType={roleType}
                  access_token={access_token}
                  item={child}
                  linkClassNames=""
                  activatedMenuItemIds={activatedMenuItemIds}
                  changeActiveMenuFromLocation={changeActiveMenuFromLocation}
                  subMenuClassNames="side-nav-third-level"
                />
              ) : (
                <MenuItem
                  role={role}
                  roleType={roleType}
                  access_token={access_token}
                  item={child}
                  className={classNames({
                    active: activatedMenuItemIds.indexOf(child.id) >= 0,
                  })}
                  linkClassName=""
                />
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </li>
  );
};

const MenuItem = ({
  role,
  roleType,
  access_token,
  item,
  className,
  linkClassName,
}: any) => {
  return (
    <li className={classNames("side-nav-item", className)}>
      <MenuItemLink
        item={item}
        access_token={access_token}
        className={linkClassName}
      />
    </li>
  );
};

const MenuItemLink = ({ item, access_token, className }: any) => {
  const Icon = item.icon || null;

  if (item?.isRefLink) {
    return (
      <a
        href={`${item.path}?access_token=${access_token}`}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames(
          "side-nav-link-ref",
          "side-sub-nav-link",
          className
        )}
      >
        {item.icon && <Icon />}
        {item.badge && (
          <span
            className={`font-size-12 badge badge-${item.badge.variant} float-right`}
          >
            {item.badge.text}
          </span>
        )}
        <span> {item.name} </span>
      </a>
    );
  }
  return (
    <Link
      to={item.path}
      className={classNames(
        "side-nav-link-ref",
        "side-sub-nav-link",
        className
      )}
    >
      {item.icon && <Icon />}
      {item.badge && (
        <span
          className={`font-size-12 badge badge-${item.badge.variant} float-right`}
        >
          {item.badge.text}
        </span>
      )}
      <span> {item.name} </span>
    </Link>
  );
};

interface RootState {
  AppMenu: any;
  Auth: {
    user: any;
    access_token: any;
    pedding: boolean;
  };
}

const mapState = (state: RootState) => {
  return {
    menu: state.AppMenu,
    user: state.Auth.user,
    access_token: state.Auth.access_token,
    pedding: state.Auth.pedding,
  };
};

const connector = connect(mapState, {
  initMenu,
  changeActiveMenuFromLocation,
  setPending,
});

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  mode?: any;
};

const AppMenu: React.FC<Props> = (props: Props) => {
  let history = useHistory();
  const isHorizontal = props.mode === "horizontal";
  const activatedKeys = isHorizontal
    ? []
    : props.menu
    ? props.menu.activatedMenuItemIds
      ? props.menu.activatedMenuItemIds
      : []
    : [] || [];
  // console.log('AppMenu',props.user.roles)
  useEffect(() => {
    if (!props.menu.menuItems) props.initMenu();
    history.listen((location: any, action: any) => {
      // hide menus in mobile
      document.body.classList.remove("sidebar-enable");
      props.changeActiveMenuFromLocation();
    });
  }, []);

  const role = props?.user?.permissions ? props?.user?.permissions : [];
  const roleType = props?.user?.role ? props?.user?.role : "";
  const access_token = props?.access_token ? props?.access_token : "";
  console.log(props, "propssVX");

  return (
    <React.Fragment>
      {props.menu && props.menu.menuItems && (
        <ul className="metismenu" id="menu-bar">
          {props.menu.menuItems.map((item: any, i: number) => {
            return (
              <React.Fragment key={item.id}>
                {item.header && !isHorizontal && (
                  <li className="menu-title" key={i + "-el"}>
                    {item.header}
                  </li>
                )}
                {item.children ? (
                  <MenuItemWithChildren
                    role={role}
                    roleType={roleType}
                    access_token={access_token}
                    csidebar-menuangeActiveMenuFromLocation={
                      props.changeActiveMenuFromLocation
                    }
                    changeActiveMenuFromLocation={
                      props.changeActiveMenuFromLocation
                    }
                    item={item}
                    subMenuClassNames="nav-second-level"
                    activatedMenuItemIds={activatedKeys}
                    linkClassNames="side-nav-link"
                  />
                ) : (
                  <MenuItem
                    role={role}
                    roleType={roleType}
                    access_token={access_token}
                    item={item}
                    className={classNames({
                      "mm-active": activatedKeys.indexOf(item.id) >= 0,
                    })}
                    linkClassName="side-nav-link"
                  />
                )}
              </React.Fragment>
            );
          })}
        </ul>
      )}
      <ModalPopup
        isOpen={props.pedding}
        onRequestClose={() => props.setPending(false)}
      >
        <RenderActionModal closeModal={() => props.setPending(false)} />
      </ModalPopup>
    </React.Fragment>
  );
};

const RenderActionModal = (props: any) => {
  const { closeModal } = props;
  return (
    <CardBody>
      <h4 className="header-title mt-0">Hệ thống đang gián đoạn</h4>
      <Col md={12}>
        <FormGroup row className="label-only">
          <p>Hệ thống tạm thời bị gián đoạn, vui lòng thử lại sau ít phút</p>
        </FormGroup>
        <FormGroup
          row
          className="label-only"
          style={{ justifyContent: "center" }}
        >
          <Button onClick={closeModal} color="primary" type="button">
            Đóng
          </Button>
        </FormGroup>
      </Col>
    </CardBody>
  );
};

export default connector(AppMenu);
