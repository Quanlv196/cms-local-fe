import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Container } from "reactstrap";

import { showRightSidebar } from "../redux/actions";

// import logo from '../assets/images/logo.png';
import logo from "../assets/images/bilet/logo-blue.png";
import { Menu } from "react-feather";
import UserProfile from "./UserProfile";

const connector = connect(null, { showRightSidebar });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  openLeftMenuCallBack: any;
};

const Topbar: React.FC<Props> = (props: Props) => {
  const router = useHistory();
  return (
    <React.Fragment>
      <div className="navbar navbar-expand flex-column flex-md-row navbar-custom">
        <Container fluid>
          {/* logo */}
          <Link
            to="/"
            className="navbar-brand mr-0 mr-md-2 logo d-flex justify-content-center"
          >
            <span className="logo-lg">
              <img src={logo} alt="" height="24" />
              {/* <span className="d-inline h5 ml-2 text-logo">BF SELLER</span> */}
            </span>
            <span className="logo-sm">
              <img src={logo} alt="" height="24" />
            </span>
          </Link>

          {/* menu*/}
          <ul className="navbar-nav bd-navbar-nav flex-row list-unstyled menu-left mb-0">
            <li className="menu__toggle">
              <div
                style={{ cursor: "pointer", marginLeft: "10px" }}
                onClick={props.openLeftMenuCallBack}
              >
                <Menu className="menu-icon" style={{ color: "#9DA1A5" }} />
                {/* <X className="close-icon" /> */}
              </div>
            </li>
            {/* <li className="menu__back"
              onClick={() => router?.goBack()}
            >
              <div className="d-flex align-items-center" style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={props.openLeftMenuCallBack}>
                <CornerUpLeft className="menu-icon" style={{ color: '#9DA1A5' }} />
                <span className="ml-2">Trở về</span>
              </div>
            </li> */}
          </ul>
          <ul className="navbar-nav flex-row ml-auto d-flex list-unstyled topnav-menu float-right mb-0">
            {/* <li className="d-none d-sm-block">
              <div className="app-search">
                <form>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search..." />
                    <Search />
                  </div>
                </form>
              </div>
            </li> */}
            {/* <UserBranch /> */}
            <UserProfile />
          </ul>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default connector(Topbar);
