import React from 'react';
import { Card, CardBody, Media } from 'reactstrap';
import NumberFormat from 'react-number-format';
import classNames from 'classnames';

interface RootState {
    color:any,
    bgClass:any,
    title:any,
    description:any,
    iconClass:any
    icon:any
}

const StatisticsWidget = (props:RootState) => {

    const Icon = props.icon;
    return (
        <Card className={classNames(props.bgClass)}>
            <CardBody className="p-0">
                <Media className="p-3">
                    <Media body>
                        <span className="text-muted text-uppercase font-size-12 font-weight-bold">{props.description}</span>
                        <h2 className="mb-0"><NumberFormat
                                value={props.title}
                                displayType={"text"}
                                thousandSeparator={true}
                                renderText={(value) => (
                                    <span>{value}</span>
                                )}
                            /></h2>
                    </Media>
                    <div className="align-self-center">
                        {Icon && <Icon className={classNames("icon-lg", props.iconClass)}></Icon>}
                    </div>
                </Media>
            </CardBody>
        </Card>
    );
};

export default StatisticsWidget;
