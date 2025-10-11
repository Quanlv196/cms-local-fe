import moment from 'moment';
import React, { Component, Fragment } from 'react'

import { Button, } from 'reactstrap';


const TimeFilter = (props:any)=>{
    const { data, handleChangeFilterDate, filter, className } = props;
    const _handleChangeFilterDate = (data:any)=>{
        handleChangeFilterDate && handleChangeFilterDate(data)
    }
    const checkActive = (timeFilter:any, timeButton:any )=>{
        if(parseInt(timeFilter.from) === moment(timeButton.from).unix()*1000 && parseInt(timeFilter.to) === moment(timeButton.to).unix()*1000) return true;
        return false
    }
    return (
        <Fragment>
            <div className={`${className} group_segmented medium`}>
                {data.map((time: any, i: number) => (
                    <div className={checkActive(filter, time) ? 'item active' : 'item'} key={i} onClick={() => _handleChangeFilterDate([time.from, time.to])} color={`${checkActive(filter, time) ? 'info' : 'outline-info'} mr-2 mb-2`}>{time.title}
                    </div>
                ))}
            </div>
            
        </Fragment>
    )
}

export default TimeFilter