import React, { Component, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { isEmpty, isNil, startsWith } from "lodash";

import { getUseDetail, setBranch } from '../redux/actions';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button } from 'reactstrap';
import * as FeatherIcon from 'react-feather';
import profilePic from '../assets/images/users/no-img.jpg';
import iconLocation from '../assets/images/icon-location.png';
import APIClient from '../helpers/APIClient';
import { toast } from 'react-toastify';

interface RootState {
    Auth:{
        user:any
    }
}

const mapState = (state:RootState) => {
    return {
        user: state.Auth.user,
    };
};

const connector = connect(mapState, {setBranch})

type PropsFromRedux = ConnectedProps<typeof connector>
  
type Props = PropsFromRedux & {

}

const UserBranch: React.FC<Props> = (props:Props)=>{
    const {user} = props
    const [branch, setBranch] = useState(user.branch_id)

    const handleChangeBranch = async (branch:any) => {
        setBranch(branch)
        const url = `/auth/update-branch`;
        const params = {
            branch_id: branch?.id
        }
        let response: any = await APIClient.PUT(url, params);
        if (response.error !== undefined) {
            toast.error(response.error.error_description)
            setBranch(user.branch_id)
        } else if (response.response !== undefined) {
            props.setBranch(branch)
            window.location.reload();
        }
    }

    console.log('UserBranch', user)
    
    return <React.Fragment>
        <div className="media user-profile user-location mt-2 mb-2" style={{alignItems: 'center'}}>
            <div className="media user-location-container">
                <img width={13} src={user&&user.avatar !== null && user.avatar !== undefined ? user.avatar : iconLocation} onError={(e: any) => e.target.src = iconLocation} className=" mr-2" alt="Shreyu" />
                <div className="media-body">
                    <h6 className="pro-user-name mt-0 mb-0">{branch?.name}</h6>
                </div>
                <UncontrolledDropdown className="align-self-center profile-dropdown-menu">
                    <DropdownToggle
                        data-toggle="dropdown"
                        tag="button"
                        className="btn btn-link p-0 dropdown-toggle mr-0">
                        <FeatherIcon.ChevronDown />
                    </DropdownToggle>
                    <DropdownMenu right className="topbar-dropdown-menu profile-dropdown-items">
                        {user?.branch?.data?.map((item:any, index:number)=>{
                            return(
                                <>
                                    <div onClick={()=>handleChangeBranch(item)} className="dropdown-item notify-item">
                                        <FeatherIcon.MapPin className="icon-dual icon-xs mr-2" />
                                        <span>{item?.name}</span>
                                    </div>
                                    {index + 1 < user?.branch?.data?.length &&
                                    <DropdownItem divider />}
                                </>
                            )
                        })}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>

            
        </div>
    </React.Fragment>
}

export default connector(UserBranch)
