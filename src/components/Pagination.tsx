import React, { useEffect, useState, memo } from "react";
import { Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import Select from "react-select";
import { isEmpty } from "lodash";

interface rootProps {
  limit: any;
  setLimit?: any;
  totalElements: number;
  page: number;
  setPage: any;
  link?: any;
  minimal?: any;
  numpagelist?: any;
  type?: any;
  hideLimit?: any;
}
let TEXT_FIRST_PAGE = "Trang đầu";
let TEXT_LAST_PAGE = "Trang cuối";
let TEXT_PREVIOUS_PAGE = "Trang trước";
let TEXT_NEXT_PAGE = "Trang sau";

const optionsPagination = [
  // { value: 1, label: '1 bản ghi' },
  { value: 25, label: "25 bản ghi" },
  { value: 50, label: "50 bản ghi" },
  { value: 100, label: "100 bản ghi" },
  { value: 500, label: "500 bản ghi" },
];
const Pagination = memo((props: rootProps) => {
  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  };
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  let {
    limit,
    setLimit,
    totalElements,
    page,
    setPage,
    link,
    minimal,
    numpagelist,
    type,
    hideLimit,
  } = props;
  console.log("Pagination", props);
  const previous = page !== 1 ? true : false;
  if ((page - 1) * limit >= totalElements - limit) {
    var next = false;
  } else {
    var next = true;
  }
  let numPage = Math.ceil(totalElements / limit);
  let pagination = [];
  for (var i = 1; i <= numPage; i++) {
    var paginationItem = {
      page: i,
    };
    pagination.push(paginationItem);
  }

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (windowDimensions.width <= 1000 || isMobile || minimal) {
    TEXT_FIRST_PAGE = "<<";
    TEXT_LAST_PAGE = ">>";
    TEXT_PREVIOUS_PAGE = "<";
    TEXT_NEXT_PAGE = ">";
  } else {
    // TEXT_FIRST_PAGE = 'Trang đầu';
    // TEXT_LAST_PAGE = 'Trang cuối';
    // TEXT_PREVIOUS_PAGE = 'Trang trước';
    // TEXT_NEXT_PAGE = 'Trang sau';
    TEXT_FIRST_PAGE = "<<";
    TEXT_LAST_PAGE = ">>";
    TEXT_PREVIOUS_PAGE = "<";
    TEXT_NEXT_PAGE = ">";
  }

  console.log("pagexxx", page, totalElements);

  return (
    <Row className="justify-content-between">
      {/* {
                !hideLimit &&
                <Col md={2} xs={12}>
                    <Select
                        className="react-select pagination-count mt-3"
                        classNamePrefix="react-select"
                        options={numpagelist || optionsPagination}
                        defaultValue={limit}
                        value={(numpagelist && numpagelist || optionsPagination && optionsPagination).filter((option:any) => option.value == limit)}
                        onChange={(val)=>{
                            setLimit(val.value)
                            type != 'noresetpage' && setPage(1)
                        }}
                        menuPlacement="top"
                    ></Select>
                </Col>
            } */}
      {!hideLimit && (
        <Col md={minimal ? 6 : 12} xs={12}>
          <div className="d-flex align-items-center justify-content-end mt-3">
            <p className="mb-0 mr-4">
              Tổng số: <span>{totalElements}</span> kết quả
            </p>
            <Select
              className="react-select pagination-count"
              classNamePrefix="react-select"
              style={{ width: 120 }}
              options={numpagelist || optionsPagination}
              defaultValue={limit}
              value={(
                (numpagelist && numpagelist) ||
                (optionsPagination && optionsPagination)
              ).filter((option: any) => option.value == limit)}
              onChange={(val) => {
                setLimit(val.value);
                type != "noresetpage" && setPage(1);
              }}
              menuPlacement="top"
            ></Select>
          </div>
        </Col>
      )}
      <Col md={minimal ? 6 : 12} xs={12}>
        <ul className="pagination mt-3 mb-2 justify-content-center">
          {/* {
                        pagination && pagination.map((item, i) => (
                            item.page === 1 &&
                            <li key={item.page} className={`paginate_button page-item ${!previous && "disabled"}`}>
                                {link ?
                                    <Link to={`${link}?page=${item.page}`} onClick={() => { { item.page !== page && setPage(item.page) } }} className="page-link">{isMobile ? '<<' : TEXT_FIRST_PAGE}</Link> :
                                    <a href="javascript:;" onClick={() => { { item.page !== page && setPage(item.page) } }} className="page-link">{isMobile ? '<<' : TEXT_FIRST_PAGE}</a>
                                }
                            </li>
                        ))
                    } */}
          {!minimal && !isEmpty(pagination) && (
            <li
              className={`paginate_button page-item previous ${
                !previous && "disabled"
              }`}
            >
              <Link
                to={`${link}?page=${page - 1}`}
                onClick={() => {
                  {
                    setPage(page - 1);
                  }
                }}
                className="page-link"
              >
                {isMobile ? "<" : TEXT_PREVIOUS_PAGE}
              </Link>
            </li>
          )}
          {pagination &&
            pagination.map(
              (item, i) =>
                item.page <= page &&
                item.page >= page - 3 && (
                  <li
                    key={item.page}
                    className={`paginate_button page-item ${
                      item.page === page && "active"
                    }`}
                  >
                    {link ? (
                      <Link
                        to={`${link}?page=${item.page}`}
                        onClick={() => {
                          {
                            item.page !== page && setPage(item.page);
                          }
                        }}
                        className="page-link"
                      >
                        {item.page}
                      </Link>
                    ) : (
                      <a
                        href="javascript:;"
                        onClick={() => {
                          {
                            item.page !== page && setPage(item.page);
                          }
                        }}
                        className="page-link"
                      >
                        {item.page}
                      </a>
                    )}
                  </li>
                )
            )}
          {pagination &&
            pagination.map(
              (item, i) =>
                item.page > page &&
                item.page <= page + 3 && (
                  <li
                    key={item.page}
                    className={`paginate_button page-item ${
                      item.page === page && "active"
                    }`}
                  >
                    {link ? (
                      <Link
                        to={`${link}?page=${item.page}`}
                        onClick={() => {
                          {
                            item.page !== page && setPage(item.page);
                          }
                        }}
                        className="page-link"
                      >
                        {item.page}
                      </Link>
                    ) : (
                      <a
                        href="javascript:;"
                        onClick={() => {
                          {
                            item.page !== page && setPage(item.page);
                          }
                        }}
                        className="page-link"
                      >
                        {item.page}
                      </a>
                    )}
                  </li>
                )
            )}
          {!minimal && !isEmpty(pagination) && (
            <li
              className={`paginate_button page-item next ${
                !next && "disabled"
              }`}
            >
              {link ? (
                <Link
                  to={`${link}?page=${page + 1}`}
                  onClick={() => {
                    {
                      setPage(page + 1);
                    }
                  }}
                  className="page-link"
                >
                  {isMobile ? ">" : TEXT_NEXT_PAGE}
                </Link>
              ) : (
                <a
                  href="javascript:;"
                  onClick={() => {
                    {
                      setPage(page + 1);
                    }
                  }}
                  className="page-link"
                >
                  {isMobile ? ">" : TEXT_NEXT_PAGE}
                </a>
              )}
            </li>
          )}
          {/* {
                        pagination && pagination.map((item, i) => (
                            item.page === pagination.length &&
                            <li key={item.page} className={`paginate_button page-item ${item.page === page && "disabled"}`}>
                                {link ?
                                    <Link to={`${link}?page=${item.page}`} onClick={() => { { item.page !== page && setPage(item.page) } }} className="page-link">{isMobile ? '>>' : TEXT_LAST_PAGE}</Link> :
                                    <a href="javascript:;" onClick={() => { { item.page !== page && setPage(item.page) } }} className="page-link">{isMobile ? '>>' : TEXT_LAST_PAGE}</a>
                                }
                            </li>
                        ))
                    } */}
        </ul>
      </Col>
    </Row>
  );
});
export default Pagination;
