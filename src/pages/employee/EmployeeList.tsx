// import { Button, Card, Col, Input, message, Row } from 'antd';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { Button, CardBody, Col, Row, Table } from "reactstrap";
import { Avatar, Checkbox, DatePicker, Drawer, Form, Input } from "antd";
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
import moment from "moment";
import {
  MISSION_COMPLETE_OPTIONS,
  NATION_OPTIONS,
  OBJECT_OPTIONS,
  POSITION_OPTIONS,
  REGILION_OPTIONS,
  ROLE_OPTIONS,
  STATUS_OPTIONS,
} from "../../constants/app.constant";
import { Employee } from "../../interfaces/employee.interface";
import { Filter, Trash2 } from "react-feather";
import { DebounceSelect } from "../../common/DebounceSelect";
import { Battalion } from "../configs/battalion/BattalionList";
import { Company } from "../configs/company/CompanyList";
import { Platoon } from "../configs/platoon/PlatoonList";
import DataUtils from "../../helpers/DataUtils";
import { useUser } from "../../hooks/useUser";
import { Role } from "../../enums/common.enum";
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
  titlePage: "Danh sách quân nhân",
  pathPage: "/users/list",
  column: 9,
};

const List: React.FC<Props> = (props: any) => {
  const [{ page, limit, filter }, setParams] = useState<any>(initialParams);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Employee[]>([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState({});
  const searchPrams = queryString.parse(props.location.search);
  const router = useHistory();

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

  console.log("filterxx", filter);

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
    if (!isEmpty(searchPrams)) {
      const newFilter = DataUtils.convertSearchParams(searchPrams, [
        "page",
        "limit",
      ]);

      if (searchPrams.page) setPage(Number(searchPrams.page));
      if (searchPrams.limit) setLimit(Number(searchPrams.limit));
      setFilter(newFilter);
    }
  };

  console.log("filterxx", filter);

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
    // Xóa các key có giá trị null, undefined, hoặc chuỗi rỗng
    Object.keys(params).forEach((key) => {
      if (
        params[key] === null ||
        params[key] === undefined ||
        params[key] === ""
      ) {
        delete params[key];
      }
    });
    const URL = `${baseUrl}/employee`;
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
        title="Quản lý Quân nhân"
        breadCrumbItems={[{ label: "Quản lý quân nhân", active: true }]}
        rightContent={
          <div className="group__button  ">
            <Button
              color="primary"
              onClick={() => router?.push("/employee/add")}
              className="bilet_button"
            >
              <i className="uil-plus"></i> Thêm quân nhân
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [battalion, setBattalion] = useState<Battalion[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [platoon, setPlatoon] = useState<Platoon[]>([]);
  const { RangePicker } = DatePicker;
  const user = useUser();

  useEffect(() => {
    fetchBattalion();
    fetchCompany();
    fetchPlatoon();
  }, []);

  const filterCount = useMemo(() => {
    return Object.keys(DataUtils.convertSearchParams(filter))?.length;
  }, [filter]);

  useEffect(() => {
    setCode(filter?.name);
  }, [filter?.name]);

  const fetchBattalion = async (name?: string) => {
    const URL = `${baseUrl}/battalion`;
    const response: any = await APIClient.GET(URL, { name });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setBattalion(response.response?.data);
    }
  };

  const fetchCompany = async (name?: string) => {
    const URL = `${baseUrl}/company`;
    const response: any = await APIClient.GET(URL, { name });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setCompany(response.response?.data);
    }
  };

  const fetchPlatoon = async (name?: string) => {
    const URL = `${baseUrl}/platoon`;
    const response: any = await APIClient.GET(URL, { name });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setPlatoon(response.response?.data);
    }
  };

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
            <Col xxl={3} md={4}>
              <Input
                prefix={
                  <i style={{ color: "#7E8B99" }} className="uil-search"></i>
                }
                allowClear
                onKeyPress={_onKeyPress}
                onChange={(e: any) => setCode(e.target.value)}
                value={code}
                placeholder="Tìm kiếm quân nhân"
              />
            </Col>
            <Col xxl={2} md={3}>
              <DebounceSelect
                value={filter?.status}
                labelInValue={false}
                allowClear
                placeholder="Chọn trạng thái"
                onChange={(dt: any) => {
                  setFilter({
                    ...filter,
                    status: dt,
                  });
                }}
                style={{ width: "100%" }}
                optionDefault={STATUS_OPTIONS}
              />
            </Col>
            <Col md={5}>
              <div className="d-flex" style={{ gap: 12 }}>
                <Button
                  color="primary"
                  className="bilet_button outline"
                  outline
                  onClick={() => setIsOpen(true)}
                >
                  <Filter size={18} /> Bộ lọc nâng cao
                  {filterCount > 0 && ` (${filterCount ?? 0})`}
                </Button>
                {filterCount > 0 && (
                  <Button
                    color="primary"
                    className="bilet_button"
                    outline
                    onClick={() => setFilter({})}
                  >
                    <Trash2 size={18} /> Xoá bộ lọc
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Drawer
        title="Bộ lọc nâng cao"
        onClose={() => setIsOpen(false)}
        visible={isOpen}
        className="form_normal"
      >
        <Form layout="vertical">
          <Form.Item label="Năm sinh">
            <RangePicker
              picker="year"
              value={
                filter?.birthday_form
                  ? [
                      moment(filter?.birthday_form, "x"),
                      moment(filter?.birthday_to, "x"),
                    ]
                  : null
              }
              disabledDate={(current) =>
                current && current.year() > new Date().getFullYear()
              }
              onChange={(value) => {
                if (value && value?.length === 2) {
                  const [from, to] = value || [];
                  setFilter({
                    ...filter,
                    birthday_form: moment(from)?.valueOf(),
                    birthday_to: moment(to)?.valueOf(),
                  });
                } else {
                  setFilter({
                    ...filter,
                    birthday_form: undefined,
                    birthday_to: undefined,
                  });
                }
              }}
              placeholder={["Từ năm", "Đến năm"]}
            />
          </Form.Item>
          <Form.Item label="Đối tượng">
            <DebounceSelect
              labelInValue={false}
              value={filter?.object_type}
              placeholder="Chọn đối tượng"
              allowClear
              onChange={(dt: any) => {
                setFilter({
                  ...filter,
                  object_type: dt,
                });
              }}
              style={{ width: "100%" }}
              optionDefault={OBJECT_OPTIONS}
            />
          </Form.Item>
          <Form.Item label="Cấp bậc">
            <DebounceSelect
              labelInValue={false}
              value={filter?.role_type}
              placeholder="Chọn đối tượng"
              allowClear
              onChange={(dt: any) => {
                setFilter({
                  ...filter,
                  role_type: dt,
                });
              }}
              style={{ width: "100%" }}
              optionDefault={ROLE_OPTIONS}
            />
          </Form.Item>
          <Form.Item label="Chức vụ">
            <DebounceSelect
              labelInValue={false}
              value={filter?.position_type}
              placeholder="Chọn đối tượng"
              allowClear
              onChange={(dt: any) => {
                setFilter({
                  ...filter,
                  position_type: dt,
                });
              }}
              style={{ width: "100%" }}
              optionDefault={POSITION_OPTIONS}
            />
          </Form.Item>
          {user.role === Role.admin && (
            <Form.Item label="Thuộc tiểu đoàn">
              <DebounceSelect
                value={filter?.battalion_id}
                placeholder="Chọn tiểu đoàn"
                labelInValue={false}
                allowClear
                fetchOptions={fetchBattalion}
                onChange={(dt: any) => {
                  setFilter({
                    ...filter,
                    battalion_id: dt,
                  });
                }}
                style={{ width: "100%" }}
                optionDefault={battalion}
              />
            </Form.Item>
          )}
          {!isNil(user?.battalion_id) ||
            (user?.role === Role.admin && (
              <Form.Item label="Thuộc đại đội">
                <DebounceSelect
                  value={filter?.company_id}
                  placeholder="Chọn đại đội"
                  labelInValue={false}
                  allowClear
                  fetchOptions={fetchCompany}
                  onChange={(dt: any) => {
                    setFilter({
                      ...filter,
                      company_id: dt,
                    });
                  }}
                  style={{ width: "100%" }}
                  optionDefault={company}
                />
              </Form.Item>
            ))}
          {(!isNil(user?.company_id) ||
            !isNil(user?.battalion_id) ||
            user?.role === Role.admin) && (
            <Form.Item label="Thuộc trung đội">
              <DebounceSelect
                value={filter?.platoon_id}
                placeholder="Chọn trung đội"
                labelInValue={false}
                allowClear
                fetchOptions={fetchPlatoon}
                onChange={(dt: any) => {
                  setFilter({
                    ...filter,
                    platoon_id: dt,
                  });
                }}
                style={{ width: "100%" }}
                optionDefault={platoon}
              />
            </Form.Item>
          )}

          <Form.Item label="Dân tộc">
            <DebounceSelect
              labelInValue={false}
              value={filter?.nation_type}
              placeholder="Chọn dân tộc"
              allowClear
              onChange={(dt: any) => {
                setFilter({
                  ...filter,
                  nation_type: dt,
                });
              }}
              style={{ width: "100%" }}
              optionDefault={NATION_OPTIONS}
            />
          </Form.Item>
          <Form.Item label="Tôn giáo">
            <DebounceSelect
              labelInValue={false}
              value={filter?.religion_type}
              placeholder="Chọn tôn giáo"
              allowClear
              onChange={(dt: any) => {
                setFilter({
                  ...filter,
                  religion_type: dt,
                });
              }}
              style={{ width: "100%" }}
              optionDefault={REGILION_OPTIONS}
            />
          </Form.Item>
          <Form.Item label="Mức độ hoàn thành NV">
            <DebounceSelect
              labelInValue={false}
              value={filter?.mission_result}
              placeholder="Chọn mức độ"
              allowClear
              onChange={(dt: any) => {
                setFilter({
                  ...filter,
                  mission_result: dt,
                });
              }}
              style={{ width: "100%" }}
              optionDefault={MISSION_COMPLETE_OPTIONS}
            />
          </Form.Item>
          <Form.Item label="" className="m-0">
            <Checkbox
              checked={filter?.is_care}
              onChange={(event: any) =>
                setFilter({ ...filter, is_care: event?.target?.checked })
              }
            >
              Các quân nhân cần quan tâm
            </Checkbox>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

const DataTableList = (props: any) => {
  const { data, limit, page, handleActionModal } = props;
  const start = limit * (page - 1);
  const router = useHistory();

  const getLabelStatus = (status: any) => {
    switch (status) {
      case 0:
        return <span className="label__status warning">Ngưng</span>;
      case 1:
        return <span className="label__status success">Hoạt động</span>;
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
          <th
            style={{
              minWidth: 150,
              position: "sticky",
              left: 0,
              zIndex: 9,
              background: "#e9ecef",
            }}
          >
            Tên quân nhân
          </th>
          <th style={{ minWidth: 100 }}>Năm sinh</th>
          <th style={{ minWidth: 300 }}>Quê quán</th>
          <th style={{ minWidth: 300 }}>Chỗ ở hiện nay</th>
          <th style={{ minWidth: 150 }}>Đối tượng</th>
          <th style={{ minWidth: 200 }}>Cấp bậc</th>
          <th style={{ minWidth: 200 }}>Chức vụ</th>
          <th style={{ minWidth: 300 }}>Đơn vị</th>
          <th style={{ minWidth: 100 }}>Dân tộc</th>
          <th style={{ minWidth: 150 }}>Tôn giáo</th>
          <th style={{ minWidth: 200 }}>Kết quả hoàn thành NV</th>
          <th style={{ minWidth: 150 }}>Cần quan tâm?</th>
          <th style={{ minWidth: 100 }}>Trạng thái</th>
          <th
            style={{
              minWidth: 60,
              position: "sticky",
              right: 0,
              zIndex: 9,
              background: "#e9ecef",
            }}
          >
            Thao tác
          </th>
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
          data.map((item: Employee, index: number) => (
            <tr>
              <td>{start + index + 1}</td>
              <td
                style={{
                  minWidth: 150,
                  position: "sticky",
                  left: 0,
                  zIndex: 7,
                  background: "#fff",
                }}
              >
                {item?.name || "---"}
              </td>
              <td>{moment(item?.birthday).format("YYYY") || "---"}</td>
              <td>{item?.home_town || "---"}</td>
              <td>{item?.current_residence || "---"}</td>
              <td>
                {OBJECT_OPTIONS?.find((e) => e?.value === item?.object)
                  ?.label || "---"}
              </td>
              <td>
                <div>
                  {ROLE_OPTIONS?.find((e) => e?.value === item?.role)?.label ||
                    "---"}
                </div>
                <div>{moment(item?.role_time).format("MM/YYYY")}</div>
              </td>
              <td>
                <div>
                  {POSITION_OPTIONS?.find((e) => e?.value === item?.position)
                    ?.label || "---"}
                </div>
                <div>{moment(item?.position_time).format("MM/YYYY")}</div>
              </td>
              <td>{`${item?.platoon?.name}/${item?.company?.name}/${item?.battalion?.name}`}</td>
              <td>
                {NATION_OPTIONS?.find((e) => e?.value === item?.nation)
                  ?.label || "---"}
              </td>
              <td>
                {REGILION_OPTIONS?.find((e) => e?.value === item?.religion)
                  ?.label || "---"}
              </td>
              <td>
                {MISSION_COMPLETE_OPTIONS?.find(
                  (e) => e?.value === item?.mission_result
                )?.label || "---"}
              </td>
              <td>{item?.is_care && "Cần quan tâm"}</td>
              <td>{getLabelStatus(item?.status)}</td>
              <td
                style={{
                  minWidth: 60,
                  position: "sticky",
                  right: 0,
                  zIndex: 7,
                  background: "#fff",
                }}
              >
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
                    onClick={() => router?.push(`/employee/${item?.id}`)}
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
      <div className="libet-table h-380">
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
    const URL = `${baseUrl}/employee/${action?.data?.id}`;
    setLoading(true);
    let response: any = await APIClient.DELETE(URL);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      closeModal?.();
      loadData?.();
      toast.success("Xóa quân nhân thành công!");
    }
  };

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
        <h5 className="text-center" style={{ color: "#C12818", fontSize: 24 }}>
          Xóa quân nhân
        </h5>
        <p className="text-center" style={{ fontSize: 16 }}>
          Bạn có muốn xóa quân nhân{" "}
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
};

export default List;
