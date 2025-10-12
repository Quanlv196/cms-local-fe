// import { Button, Card, Col, Input, message, Row } from 'antd';
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, CardBody, Col, Row, Table } from "reactstrap";
import { Avatar, Input } from "antd";
import { useHistory } from "react-router";
import queryString from "query-string";
import { isEmpty, isNil } from "lodash";
import { baseUrl } from "../../constants/environment";
import APIClient from "../../helpers/APIClient";
import PageTitle from "../../components/PageTitle";
import PageBody from "../../components/PageBody";
import Pagination from "../../components/Pagination";
import ModalPopup from "../../components/ModalPopup";
import Loader from "../../components/Loader";
import RowEmpty from "../../components/RowEmpty";
import UsersAdd from "./UsersAdd";
interface Props {
  history: any;
  location: any;
}
const initialParams = {
  page: 1,
  limit: 25,
  filter: {},
};

const configPage = {
  titlePage: "Danh sách tài khoản",
  pathPage: "/users/list",
  column: 9,
};

const List: React.FC<Props> = (props: any) => {
  const [{ page, limit, filter }, setParams] = useState<any>(initialParams);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState({});
  const [status, setStatus] = useState(null);
  const [item, setItem] = useState({});
  const [ids, setIds] = useState([]);
  const searchPrams = queryString.parse(props.location.search);
  const [dataChecked, setDataChecked] = useState<any>([]);

  const setPage = (value: number) => {
    setParams((prevState: any) => ({
      ...prevState,
      page: value,
    }));
  };

  const setLimit = (value: number) => {
    setParams((prevState: any) => ({
      ...prevState,
      limit: value,
    }));
  };

  const setFilter = (value: {}) => {
    setParams((prevState: any) => ({
      ...prevState,
      filter: value,
      page: 1,
    }));
  };

  useEffect(() => {
    document.title = configPage.titlePage;
    getFilterParams();
  }, []);

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (!isEmpty(searchPrams) && !loading) {
      loadData();
    }
  }, [limit, page, filter]);

  useEffect(() => {
    if (isEmpty(searchPrams)) {
      setParams(initialParams);
      loadData();
    }
  }, [searchPrams]);

  const handleActionModal = (item: any) => {
    setAction(item);
    setIsOpen(true);
  };

  const getFilterParams = () => {
    const newFilter: any = {};
    if (!isEmpty(searchPrams)) {
      Object.keys(searchPrams).map(function (key) {
        switch (key) {
          case "page":
            setPage(Number(searchPrams[key]));
            break;
          case "limit":
            setLimit(Number(searchPrams[key]));
            break;
          default:
            newFilter[key] = searchPrams[key];
            break;
        }
      });
      setFilter(newFilter);
    }
  };

  const setFilterParams = (params: any) => {
    var filterParams = "";
    Object.keys(params).map(function (item, i) {
      if (i === 0) {
        filterParams = filterParams + "?" + item + "=" + params[item];
      } else {
        filterParams = filterParams + "&" + item + "=" + params[item];
      }
    });
    props.history.push({
      search: filterParams,
    });
  };
  const loadData = async () => {
    const params: any = {
      page: page,
      limit: limit,
      ...filter,
    };
    if (params?.name === "" || !!!params?.name) {
      delete params?.name;
    }
    if (params?.sex === "" || !!!params?.sex) {
      delete params?.sex;
    }
    const URL = `${baseUrl}/user`;
    setFilterParams(params);
    setLoading(true);
    let response: any = await APIClient.GET(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      let DataArr: any = [];
      response.response.data?.map((e: any) => {
        DataArr?.push({
          ...e,
          value: e?.id,
          label: e?.name,
        });
      });
      setData(DataArr);
      setTotalElements(response.response.total);
    }
  };

  return (
    <React.Fragment>
      <PageTitle
        title="Quản lý tài khoản"
        breadCrumbItems={[{ label: "Quản lý tài khoản", active: true }]}
        rightContent={
          <div className="group__button  ">
            <Button
              color="primary"
              onClick={() => handleActionModal({ type: "add" })}
              className="bilet_button"
            >
              <i className="uil-plus"></i> Thêm tài khoản
            </Button>
          </div>
        }
      />
      <PageBody>
        <DataFilter
          filter={filter}
          setFilter={(filter: any) => setFilter(filter)}
          loadData={loadData}
        />
        <DataTableList
          data={data}
          loading={loading}
          handleActionModal={(id: any) => handleActionModal(id)}
          page={page}
          limit={limit}
          dataChecked={dataChecked}
          setDataChecked={(val: any) => setDataChecked(val)}
        />
        <Pagination
          link={configPage.pathPage}
          setPage={(page: number) => setPage(page)}
          page={page}
          limit={limit}
          setLimit={(limit: number) => setLimit(limit)}
          totalElements={totalElements}
        />
      </PageBody>
      <ModalPopup
        isOpen={modalIsOpen}
        onRequestClose={() => {
          setIsOpen(false);
          loadData();
        }}
      >
        <RenderActionModal
          item={item}
          setDataChecked={(val: any) => setDataChecked(val)}
          status={status}
          category={data}
          loadData={loadData}
          closeModal={() => {
            setIsOpen(false);
          }}
          action={action}
        />
      </ModalPopup>
      {loading && <Loader />}
    </React.Fragment>
  );
};

const DataFilter = (props: any) => {
  const { setFilter, filter, loadData } = props;
  const [code, setCode] = useState(filter?.query);
  const updateTimeoutRef = useRef<any>(null);

  useEffect(() => {
    setCode(filter.query);
  }, [filter.query]);

  useEffect(() => {
    if (isNil(code)) return;
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      setFilter({
        ...filter,
        name: code,
      });
    }, 500);
  }, [code]);

  const _onKeyPress = async (e: any) => {
    if (e.key === "Enter") {
      setFilter({
        ...filter,
        name: e?.target?.value,
      });
    }
  };

  return (
    <div className="filter-custom pb-3 mb-3">
      <Row className="form_normal">
        <Col md={9}>
          <Row>
            <Col md={7}>
              <Input
                prefix={
                  <i style={{ color: "#7E8B99" }} className="uil-search"></i>
                }
                allowClear
                onKeyPress={_onKeyPress}
                onChange={(e: any) => setCode(e.target.value)}
                value={code}
                placeholder="Tìm kiếm tài khoản"
              />
            </Col>
            <Col md={2}>
              <Button
                color="primary"
                className="bilet_button height-44"
                outline
                onClick={loadData}
              >
                <i className="uil-search"></i> Tìm kiếm
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

const DataTableList = (props: any) => {
  const { data, loading, limit, page, handleActionModal, dataChecked } = props;
  const start = limit * (page - 1);
  const router = useHistory();

  const getLabelStatus = (status: any) => {
    switch (status) {
      case 0:
        {
          return <span className="label__status warning">Ngưng</span>;
        }
        break;
      case 1:
        {
          return <span className="label__status success">Hoạt động</span>;
        }
        break;
      default: {
        return "---";
      }
    }
  };

  const RenderHeadData = () => {
    return (
      <thead>
        <tr>
          <th style={{ minWidth: 50 }}>Stt</th>
          <th style={{ minWidth: 120 }}>Tên tài khoản</th>
          <th style={{ minWidth: 120 }}>Tên người dùng</th>
          <th style={{ minWidth: 100 }}>Tiểu đoàn</th>
          <th style={{ minWidth: 100 }}>Đại đội</th>
          <th style={{ minWidth: 100 }}>Trung đội</th>
          <th style={{ minWidth: 100 }}>Trạng thái</th>
          <th style={{ width: 60 }}></th>
        </tr>
      </thead>
    );
  };

  const RenderBobyData = () => {
    if (data.length === 0) {
      return (
        <RowEmpty
          column={configPage.column}
          title="Không tồn tại bản ghi nào"
        />
      );
    }
    return (
      <tbody>
        {data &&
          data.map((item: any, index: number) => (
            <tr>
              <td>{start + index + 1}</td>
              <td>{item?.username || "---"}</td>
              <td>{item?.name || "---"}</td>
              <td>{item?.battalion?.name || "---"}</td>
              <td>{item?.company?.name || "---"}</td>
              <td>{item?.platoon?.name || "---"}</td>
              <td>{getLabelStatus(item?.status)}</td>
              <td>
                <div className="list__action_table">
                  <div
                    onClick={() =>
                      handleActionModal({ type: "delete", data: item })
                    }
                    className="item bg_danger"
                  >
                    <i className="uil-trash-alt"></i>
                  </div>
                  <div
                    onClick={() =>
                      handleActionModal({ type: "edit", data: item })
                    }
                    className="item bg_primary"
                  >
                    <i className="uil-pen"></i>
                  </div>
                </div>
              </td>
            </tr>
          ))}
      </tbody>
    );
  };
  return (
    <>
      {dataChecked?.length > 0 && (
        <div className="selected_box mb-3">
          <span className="mr-2">{`${dataChecked?.length} tài khoản được chọn`}</span>
          <div className="d-flex align-items-center">
            <div
              className="button_checked danger"
              onClick={() =>
                handleActionModal({ type: "delele_all", data: dataChecked })
              }
            >
              Xóa tất cả
            </div>
            <div
              className="button_checked warning"
              onClick={() =>
                handleActionModal({ type: "stop_all", data: dataChecked })
              }
            >
              Ngưng hoạt động tất cả
            </div>
          </div>
        </div>
      )}
      <div className="libet-table">
        <Table responsive bordered className="table">
          <RenderHeadData />
          <RenderBobyData />
        </Table>
      </div>
    </>
  );
};

const RenderActionModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const { closeModal, loadData, action } = props;

  const handleDelete = async () => {
    const URL = `${baseUrl}/user/${action?.data?.id}`;
    setLoading(true);
    let response: any = await APIClient.DELETE(URL);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      closeModal?.();
      loadData?.();
      toast.success("Xóa tài khoản thành công!");
    }
  };

  if (action?.type == "delete") {
    return (
      <CardBody className="p-0" style={{ width: 400 }}>
        <div className="modal-header" style={{ border: "none" }}>
          <button onClick={() => closeModal()} type="button" className="close">
            {" "}
            <span aria-hidden="true">×</span>{" "}
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <Avatar
            className="d-flex justify-content-center align-items-center"
            style={{ width: 60, height: 60, backgroundColor: "#FEF0C7" }}
            icon={
              <i
                style={{ color: "#C12818", fontSize: 26 }}
                className="uil-trash-alt"
              ></i>
            }
          />
        </div>
        <div className="p-3">
          <h5
            className="text-center"
            style={{ color: "#C12818", fontSize: 24 }}
          >
            Xóa tài khoản
          </h5>
          <p className="text-center" style={{ fontSize: 16 }}>
            Bạn có muốn xóa tài khoản{" "}
            <b style={{ color: "#272E35" }}>{`"${action?.data?.name}"`}</b>?
          </p>
        </div>

        <div className="modal-footer">
          <Button
            onClick={handleDelete}
            className="ml-2 bilet_button"
            color="success"
            type="button"
          >
            Có
          </Button>
          <Button
            onClick={closeModal}
            className="ml-2 bilet_button outline"
            color="success"
            type="button"
          >
            Không
          </Button>
        </div>
        {loading && <Loader />}
      </CardBody>
    );
  }

  return (
    <CardBody className="p-0" style={{ width: 600 }}>
      <div className="modal-header">
        <h5 className="modal-title" id="modal-action-title">
          Thêm tài khoản
        </h5>
        <button onClick={() => closeModal()} type="button" className="close">
          {" "}
          <span aria-hidden="true">×</span>{" "}
        </button>
      </div>
      <UsersAdd
        closeModal={closeModal}
        loadData={() => loadData()}
        dataProps={action}
      />
      {loading && <Loader />}
    </CardBody>
  );
};

export default List;
