import React from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';

const PageBody = (props: any) => {
    const classes = props.className;
    const classesBody = props.classNameBody;
    console.log("props?.style", props?.style)
    return (
        <div className={`${classes} page__container`} style={{ ...props?.style }}>
            <Card>
                <CardBody className={classesBody}>
                    {props.children}
                </CardBody>
            </Card>
        </div>
    )
}

export default PageBody;