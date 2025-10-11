import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Dropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import { Bell } from "react-feather";

import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { connect } from "react-redux";
import APIClient from "../helpers/APIClient";
import moment from "moment";
import { baseUrl } from "../constants/environment";
import { toast } from "react-toastify";
import MessageManager from "../manager/MessageManager";
import { Spin } from "antd";

const notificationContainerStyle = {
  maxHeight: "430px",
};

interface RootState {
  tag: any;
  user: any;
}

const NotificationDropdown: React.FC<RootState> = (props: RootState) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 200;
  const route = useHistory();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    MessageManager.addListener({
      onUpdatePaymentStatus,
    });
    return () => {
      MessageManager.removeListener("onUpdatePaymentStatus");
    };
  }, []);

  const onUpdatePaymentStatus = (dataPayment: any) => {
    console.log("dataPayment", dataPayment);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const loadData = async () => {
    const params: any = {
      page: page,
      limit: limit,
      // ...filter,
    };
    const URL = `${baseUrl}/notification`;
    setLoading(true);
    let response: any = await APIClient.GET(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      setData(response.response.data);
      const totalNotRead = response.response.data?.reduce(
        (prev: any, item: any) => {
          if (item?.status === 0) {
            prev += 1;
          }
          return prev;
        },
        0
      );
      setTotalElements(totalNotRead);
    }
  };
  interface itemNoti {
    bgColor: any;
    icon: any;
    id: any;
    text: any;
    subText: any;
  }

  const chooseItem = async (item: any) => {
    const URL = `${baseUrl}/notification/read/${item?.id}`;
    setLoading(true);
    let response: any = await APIClient.PUT(URL);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      loadData();
      route?.push(item?.link);
    }
  };

  const tag = props.tag || "div";

  return (
    <React.Fragment>
      <Dropdown
        isOpen={dropdownOpen}
        toggle={() => {
          toggleDropdown();
          loadData();
        }}
        className="notification-list"
        tag={tag}
        id="notiDropdown"
      >
        <DropdownToggle
          data-toggle="dropdown"
          tag="a"
          className="nav-link dropdown-toggle"
          onClick={toggleDropdown}
          aria-expanded={dropdownOpen}
        >
          <Bell />
          {totalElements > 0 && (
            <span className="noti-icon-badge font-size-12">
              {totalElements}
            </span>
          )}
        </DropdownToggle>
        <DropdownMenu right className="dropdown-lg" style={{ padding: 0 }}>
          <div onClick={toggleDropdown}>
            <div
              className="dropdown-item noti-title border-bottom"
              style={{ padding: "15px 20px" }}
            >
              <h5 className="m-0 font-size-16">
                <span className="float-right">
                  {/* <Link to="/notifications" className="text-dark">
                                    <small>Clear All</small>
                                </Link> */}
                </span>
                Thông báo
              </h5>
            </div>
            {data?.length === 0 && !loading ? (
              <div style={notificationContainerStyle}>
                <div
                  style={{
                    height: "228px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Chưa có thông báo nào !!!
                </div>
              </div>
            ) : (
              <PerfectScrollbar
                style={notificationContainerStyle}
                onYReachEnd={() => {
                  if (!loading && limit * page < data?.length) {
                    // setPage(page + 1)
                    console.log("noti", page, data?.length);
                  }
                }}
              >
                {data.map((item: any, i: number) => {
                  return (
                    <div
                      onClick={() => chooseItem(item)}
                      className="dropdown-item notify-item"
                      key={i + "-noti"}
                      style={{
                        background: item?.status === 0 ? "#cfe7ff" : "#fff",
                      }}
                    >
                      <div className={`notify-icon bg-info`}>
                        <i className="uil uil-comment-message"></i>
                      </div>
                      <p className="notify-details">
                        {item.title}
                        <small
                          className="text-muted mt-1 mb-1"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        ></small>
                        <small className="text-muted">
                          {moment(item?.mail_message_id?.create_date)
                            .add(7, "hours")
                            .format("DD/MM/YYYY HH:mm")}
                        </small>
                      </p>
                    </div>
                  );
                })}
              </PerfectScrollbar>
            )}
            {loading && (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ padding: 20 }}
              >
                <Spin size="small" />{" "}
                <span style={{ paddingLeft: 5 }}>Đang tải</span>
              </div>
            )}
            {/* <Link to="/" className="dropdown-item text-center text-primary notify-item notify-all border-top">Đánh dấu đã đọc tất cả</Link> */}
          </div>
        </DropdownMenu>
      </Dropdown>

      {/* <UncontrolledTooltip placement="left" target="notiDropdown">{props.notifications.length} new unread notificationse</UncontrolledTooltip> */}
    </React.Fragment>
  );
};

const mapState = (state: any) => {
  return {
    user: state.Auth.user,
  };
};

export default connect(mapState)(NotificationDropdown);
