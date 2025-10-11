import React, { useEffect, useState } from 'react';
import { Row, Col} from 'reactstrap';
import { Link } from "react-router-dom";
import { isMobile } from 'react-device-detect';
import Select from 'react-select';

interface rootProps{
    limit:any, 
    setLimit?:any,
    totalElements:number, 
    page:number, 
    setPage:any, 
    link:any
}
let TEXT_FIRST_PAGE = 'Trang đầu';
let TEXT_LAST_PAGE = 'Trang cuối';
let TEXT_PREVIOUS_PAGE = 'Trang trước';
let TEXT_NEXT_PAGE = 'Trang sau';

const optionsPagination = [
    // { value: 10, label: '10 bản ghi' },
    { value: 25, label: '25 bản ghi' },
    { value: 50, label: '50 bản ghi' },
    { value: 100, label: '100 bản ghi' },
]
const Pagination = (props:rootProps) => {
    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        return {
          width,
          height
        };
    }
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let {limit, setLimit, totalElements, page, setPage, link} = props
    console.log('panigation', page)
    const previous = page !== 1 ? true : false
    if ( ((page - 1) * limit) >= (totalElements - limit)) {
        var next = false;
    } else {
        var next = true;
    }
    let numPage = Math.ceil(totalElements / limit)
    let pagination = []
    for (var i = 1; i <= numPage; i++) {
        var paginationItem = {
            page:i
        }
        pagination.push(paginationItem)
    }

    useEffect(() => {
        function handleResize() {
        setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);   

    if(windowDimensions.width <= 1000 || isMobile){
        TEXT_FIRST_PAGE = '<<';
        TEXT_LAST_PAGE = '>>';
        TEXT_PREVIOUS_PAGE = '<';
        TEXT_NEXT_PAGE = '>';
    }else{
        TEXT_FIRST_PAGE = 'Trang đầu';
        TEXT_LAST_PAGE = 'Trang cuối';
        TEXT_PREVIOUS_PAGE = 'Trang trước';
        TEXT_NEXT_PAGE = 'Trang sau';
    }

    return(
        <Row>
            <Col md={2} xs={12}>
                <Select
                    className="react-select mt-2"
                    classNamePrefix="react-select"
                    options={optionsPagination}
                    defaultValue={limit}
                    value={optionsPagination && optionsPagination.filter(option => option.value == limit)}
                    onChange={(val)=>{
                        setLimit(val.value)
                        setPage(1)
                    }}
                    menuPlacement="top"
                ></Select>
            </Col>
            <Col md={7} xs={12}>
                
                <ul className="pagination mt-2 mb-2">
                    {
                        pagination && pagination.map((item, i) => (
                            item.page === 1 &&
                                <li key={item.page} className={`paginate_button page-item ${!previous && "disabled"}`}>
                                    <Link to={`${link}?page=${item.page}`} onClick={()=>{{item.page !== page && setPage(item.page)}}} className="page-link">{isMobile ?'<<' :TEXT_FIRST_PAGE}</Link>
                                </li>
                        ))
                    }
                    <li className={`paginate_button page-item previous ${!previous && "disabled"}`}>
                        <Link to={`${link}?page=${page-1}`} onClick={()=>{{setPage(page-1)}}} className="page-link">{isMobile ?'<' :TEXT_PREVIOUS_PAGE}</Link>
                    </li>
                    {
                        pagination && pagination.map((item, i) => (
                            item.page <= page && item.page >= page-3 &&
                                <li key={item.page} className={`paginate_button page-item ${item.page === page && "active"}`}>
                                    <Link to={`${link}?page=${item.page}`} onClick={()=>{{item.page !== page && setPage(item.page)}}} className="page-link">{item.page}</Link>
                                </li>
                        ))
                    }
                    {
                        pagination && pagination.map((item, i) => (
                            item.page > page && item.page <= page+3 &&
                                <li key={item.page} className={`paginate_button page-item ${item.page === page && "active"}`}>
                                    <Link to={`${link}?page=${item.page}`} onClick={()=>{{item.page !== page && setPage(item.page)}}} className="page-link">{item.page}</Link>
                                </li>
                        ))
                    }
                    <li className={`paginate_button page-item next ${!next && "disabled"}`}>
                        <Link to={`${link}?page=${page+1}`} onClick={()=>{{setPage(page+1)}}} className="page-link">{isMobile ?'>' :TEXT_NEXT_PAGE}</Link>
                    </li>
                    {
                        pagination && pagination.map((item, i) => (
                            item.page === pagination.length &&
                                <li key={item.page} className={`paginate_button page-item ${item.page === page && "disabled"}`}>
                                    <Link to={`${link}?page=${item.page}`} onClick={()=>{{item.page !== page && setPage(item.page)}}} className="page-link">{isMobile ?'>>' :TEXT_LAST_PAGE}</Link>
                                </li>
                        ))
                    }
                </ul>
            </Col>
            <Col md={3} xs={12}>
                <p className="mt-3 ml-1">Của <b>{numPage}</b> trang | Có tất cả <b>{totalElements}</b> bản ghi</p>
            </Col>
        </Row>
    )
}
export default Pagination