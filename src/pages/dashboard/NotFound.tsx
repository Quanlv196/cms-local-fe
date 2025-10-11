import React from 'react';

import { Container, Row, Col } from 'reactstrap';
import imgNotFound from '../../assets/images/not-found.png';

const NotFound : React.FC = ()=>{
    return (
        <React.Fragment>
            <div className="account-pages my-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col xl={4} lg={5}>
                                <div className="text-center">
                                    <div>
                                        <img src={imgNotFound} alt="" className="img-fluid" />
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col className="text-center">
                                <h3 className="mt-3">Trang không tồn tại !</h3>
                                <p className="text-muted mb-5">Trang bạn truy cập không tồn tại hoặc bạn không có quyền truy cập</p>

                            </Col>
                        </Row>
                    </Container>
                </div>
        </React.Fragment>
    )
}

export default NotFound;