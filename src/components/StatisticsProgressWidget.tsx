import React from 'react';
import { Card, CardBody, Progress } from 'reactstrap';
import classNames from 'classnames';

interface RootState {
    color:any,
    type:any,
    name:any,
    bgClass:any,
    title:any,
    trend:any,
    description:any,
    progressValue:any
    progressTitle:any
}

const StatisticsProgressWidget = (props:RootState) => {

    const progressColor = props.color || "primary";
    return (
        <Card className={classNames(props.bgClass)}>
            <CardBody className="p-0">
                <div className="p-3">
                    <span className="text-muted text-uppercase font-size-12 font-weight-bold">{props.description}</span>
                    <h2>{props.title}</h2>

                    <Progress className="my-2" style={{ height: '5px' }} color={progressColor} value={props.progressValue}></Progress>

                    <span className="text-muted font-weight-semibold">{props.progressTitle}</span>
                </div>

            </CardBody>
        </Card>
    );
};

export default StatisticsProgressWidget;
