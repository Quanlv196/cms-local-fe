// @flow
import React from 'react';
import AppMenu from './AppMenu';
import { Collapse } from 'reactstrap';

interface RootState {
    isMenuOpened:any,
}

const Navbar = (props:RootState) => {
    return (
        <React.Fragment>
            <div className="topnav shadow-sm">
                <div className="container-fluid">
                    <nav className="navbar navbar-light navbar-expand-lg topbar-nav">
                        <Collapse isOpen={props.isMenuOpened} className="navbar-collapse" id="topnav-menu-content">
                            <AppMenu mode={'horizontal'} />
                        </Collapse>
                    </nav>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navbar;
