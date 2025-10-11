import React, { Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { isEmpty, isNil, startsWith } from "lodash";

import { getUseDetail } from '../redux/actions';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import * as FeatherIcon from 'react-feather';
import profilePic from '../assets/images/users/no-img.jpg';

interface RootState {
    Auth: {
        user: any
    }
}

const mapState = (state: RootState) => {
    return {
        user: state.Auth.user,
    };
};

const connector = connect(mapState, { getUseDetail })

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {

}

const UserProfile: React.FC<Props> = (props: Props) => {
    const { user } = props
    console.log("user", user)
    props.getUseDetail()
    return <React.Fragment>
        <div className="media user-profile">
            <img style={{ objectFit: 'cover' }} src={user && user.avatar !== null && user.avatar !== undefined ? user.avatar : profilePic} onError={(e: any) => e.target.src = profilePic} className="avatar-sm rounded-circle mr-2" alt="Shreyu" />
            <img style={{ objectFit: 'cover' }} src={user && user.avatar !== null && user.avatar !== undefined ? user.avatar : profilePic} onError={(e: any) => e.target.src = profilePic} className="avatar-xs rounded-circle mr-2" alt="Shreyu" />

            <div className="media-body">
                <h6 className="pro-user-name mt-0 mb-0">{user?.name || user?.username}</h6>
                <span className="pro-user-desc" style={{ textTransform: 'unset' }}>{user?.email || user?.phone}</span>
            </div>

            <UncontrolledDropdown className="align-self-center profile-dropdown-menu">
                <DropdownToggle
                    data-toggle="dropdown"
                    tag="button"
                    className="btn btn-link p-0 dropdown-toggle mr-0">
                    <FeatherIcon.ChevronDown />
                </DropdownToggle>
                <DropdownMenu right className="topbar-dropdown-menu profile-dropdown-items">
                    <Link to="/account" className="dropdown-item notify-item">
                        <FeatherIcon.User className="icon-dual icon-xs mr-2" />
                        <span>Tài khoản</span>
                    </Link>
                    <DropdownItem divider />
                    <Link to="/account/logout" className="dropdown-item notify-item">
                        <FeatherIcon.LogOut className="icon-dual icon-xs mr-2" />
                        <span>Đăng xuất</span>
                    </Link>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    </React.Fragment>
}

export default connector(UserProfile)
