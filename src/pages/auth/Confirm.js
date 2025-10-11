import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom'

import { Container, Row, Col, Card, CardBody, } from 'reactstrap';

import { isUserAuthenticated } from '../../helpers/authUtils';
import logo from '../../assets/images/logo_bigfa.png';

class Confirm extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        this._isMounted = true;
        document.body.classList.add('authentication-bg');
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.body.classList.remove('authentication-bg');
    }

    /**
     * Redirect to root
     */
    renderRedirectToRoot = () => {
        const isAuthTokenValid = isUserAuthenticated();
        if (isAuthTokenValid) {
            return <Redirect to='/' />
        }
    }

    render() {
        const isAuthTokenValid = isUserAuthenticated();
        return (
            <React.Fragment>

                {this.renderRedirectToRoot()}

                {(this._isMounted || !isAuthTokenValid) && <div className="account-pages account-pages-bg my-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="text-center">
                                    <CardBody className="p-4">
                                        <div className="mx-auto mb-5"> 
                                            <a className="logo-login" href="/">
                                            {/* <h3 className="d-inline align-middle ml-1 text-logo">Big Family</h3> */}
                                                <img src={logo} alt="" height="74" />
                                            </a>
                                        </div>
                                        
                                        <h6 className="h5 mb-0 mt-4">Đăng ký tài khoản thành công</h6>
                                        {/* <p className="text-muted mt-3 mb-3">Tài khoản của bạn đã được đăng ký thành công. Để hoàn tất quá trình xác minh, vui lòng kiểm tra email của bạn để biết yêu cầu xác thực.</p> */}
                                        <p className="text-muted mt-3 mb-3">Tài khoản của bạn đã được đăng ký thành công. Bây giờ bạn có thể đăng nhập vào hệ thống</p>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row className="mt-3">
                            <Col className="text-center">
                                <p className="text-muted">Quay lại màn đăng nhập <Link to="/account/login" className="text-primary font-weight-bold ml-1">Đăng nhập</Link></p>
                            </Col>
                        </Row>
                    </Container>
                </div>}
            </React.Fragment>
        )
    }
}

export default connect()(Confirm);