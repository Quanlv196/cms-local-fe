import React, { useEffect, useState } from "react"

const List = (props: any) => {
    const { filterType, setFilterType, isShowDay, className } = props
    useEffect(() => {

    }, []);
    return (
        <div className={`${className} group_segmented`}>
            {
                isShowDay && <div className={filterType === null ? "item active" : "item"} onClick={() => setFilterType(null)}>Ngày</div>
            }
            <div className={filterType === 'week' ? "item active" : "item"} onClick={() => setFilterType('week')}>Tuần</div>
            <div className={filterType === 'month' ? "item active" : "item"} onClick={() => setFilterType('month')}>Tháng</div>
            <div className={filterType === 'year' ? "item active" : "item"} onClick={() => setFilterType('year')}>Năm</div>
        </div>
    )
}
export default List