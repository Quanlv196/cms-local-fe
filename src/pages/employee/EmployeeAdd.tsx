import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, CardBody } from "reactstrap";
import { Checkbox, Col, DatePicker, Form, Input, Row } from "antd";
import { baseUrl } from "../../constants/environment";
import APIClient from "../../helpers/APIClient";
import PageTitle from "../../components/PageTitle";
import ModalPopup from "../../components/ModalPopup";
import Loader from "../../components/Loader";
import PageBody from "../../components/PageBody";
import { DebounceSelect } from "../../common/DebounceSelect";
import {
  MISSION_COMPLETE_OPTIONS,
  NATION_OPTIONS,
  OBJECT_OPTIONS,
  POSITION_OPTIONS,
  REGILION_OPTIONS,
  ROLE_OPTIONS,
} from "../../constants/app.constant";
import { Battalion } from "../configs/battalion/BattalionList";
import { Company } from "../configs/company/CompanyList";
import { Platoon } from "../configs/platoon/PlatoonList";
import EditorComponent from "../../common/EditorComponent";
import { isNil } from "lodash";
import DataUtils from "../../helpers/DataUtils";
import moment from "moment";

interface Props {
  history: any;
  location: any;
  match: any;
  user: any;
}

const List: React.FC<Props> = (props: any) => {
  const router = useHistory();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [data, setData] = useState<any>({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState();
  const [titlePage, setTilePage] = useState("");
  const [battalion, setBattalion] = useState<Battalion[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [platoon, setPlatoon] = useState<Platoon[]>([]);

  useEffect(() => {
    if (id && id !== "add") {
      loadData(id);
      document.title = "Chỉnh sửa quân nhân";
      setTilePage("Chỉnh sửa quân nhân");
    } else {
      document.title = "Tạo mới quân nhân";
      setTilePage("Tạo mới quân nhân");
    }
  }, [id]);

  const handleActionModal = (item: any) => {
    setAction(item);
    setIsOpen(true);
  };

  useEffect(() => {
    fetchBattalion();
  }, []);

  const fetchBattalion = async (name?: string) => {
    const URL = `${baseUrl}/battalion`;
    const response: any = await APIClient.GET(URL, { name });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setBattalion(response.response?.data);
    }
  };

  const fetchCompany = async (
    name?: string,
    battalion_id: number = data?.battalion_id?.value
  ) => {
    const URL = `${baseUrl}/company`;
    const response: any = await APIClient.GET(URL, { name, battalion_id });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setCompany(response.response?.data);
    }
  };

  const fetchPlatoon = async (
    name?: string,
    company_id: number = data?.company_id?.value
  ) => {
    const URL = `${baseUrl}/platoon`;
    const response: any = await APIClient.GET(URL, { name, company_id });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setPlatoon(response.response?.data);
    }
  };

  const loadData = async (id: number) => {
    const url = `${baseUrl}/employee/${id}`;
    setLoading(true);
    let response: any = await APIClient.GET(url);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      const resData = response.response;
      setData({
        ...resData,
        platoon_id: resData?.platoon,
        company_id: resData?.company,
        battalion_id: resData?.battalion,
      });
      fetchCompany("", resData?.battalion?.id);
      fetchPlatoon("", resData?.company?.id);
    }
  };

  return (
    <React.Fragment>
      <PageTitle
        title={titlePage}
        breadCrumbItems={[
          { label: "Quản trị", path: null },
          { label: "Quân nhân", path: "/employee/list" },
          { label: titlePage, active: true },
        ]}
      />
      <ContentPage
        data={data}
        titlePage={titlePage}
        setData={(val: any) => setData(val)}
        id={id}
        handleActionModal={(data: any) => handleActionModal(data)}
        platoon={platoon}
        fetchPlatoon={fetchPlatoon}
        company={company}
        fetchCompany={fetchCompany}
        battalion={battalion}
        fetchBattalion={fetchBattalion}
      />
      <ModalPopup isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)}>
        <RenderActionModal
          closeModal={() => setIsOpen(false)}
          action={action}
          loadData={() => loadData(id)}
        />
      </ModalPopup>
      {loading && <Loader />}
    </React.Fragment>
  );
};

const ContentPage = (props: any) => {
  const {
    data,
    setData,
    id,
    battalion,
    fetchBattalion,
    company,
    fetchCompany,
    platoon,
    fetchPlatoon,
  } = props;
  const [loading, setLoading] = useState(false);
  const router = useHistory();
  const formRef = useRef<any>(null);

  const handleChangeInput = (event?: any) => {
    let { value, name } = event.target;
    if (value === " ") return;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    await formRef?.current?.validateFields();
    const URL = `${baseUrl}/employee`;
    const params = DataUtils.formatDataForAPI({
      ...data,
      birthday: moment(data?.birthday).valueOf(),
      position_time: moment(data?.position_time).valueOf(),
      role_time: moment(data?.role_time).valueOf(),
    });
    setLoading(true);
    let response: any = await APIClient.POST(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      toast.success("Thêm mới quân nhân thành công");
      router?.push(`/employee/list`);
    }
  };

  const handleEdit = async () => {
    await formRef?.current?.validateFields();
    const URL = `${baseUrl}/employee/${data?.id}`;
    const params = DataUtils.formatDataForAPI({
      ...data,
      birthday: moment(data?.birthday).valueOf(),
      position_time: moment(data?.position_time).valueOf(),
      role_time: moment(data?.role_time).valueOf(),
    });
    setLoading(true);
    delete params?.code;
    delete params?.created_time;
    delete params?.created_uid;
    delete params?.id;
    delete params?.updated_time;
    delete params?.updated_uid;
    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      toast.success("Chỉnh sửa quân nhân thành công");
      router?.push(`/employee/list`);
    }
  };

  console.log("dataxxx", data?.role_time, moment(data?.role_time));

  return (
    <div className="detail__page" style={{ margin: 20 }}>
      <Form
        ref={formRef}
        wrapperCol={{ flex: 1 }}
        layout="vertical"
        autoComplete="off"
        className="form_normal"
        fields={[
          { name: "name", value: data.name },
          {
            name: "birthday",
            value: data.birthday ? moment(data.birthday) : null,
          },
          { name: "company_id", value: data.company_id },
          { name: "current_residence", value: data.current_residence },
          { name: "home_town", value: data.home_town },
          { name: "mission_result", value: data.mission_result },
          { name: "platoon_id", value: data.platoon_id },
          { name: "battalion_id", value: data.battalion_id },
          { name: "position", value: data.position },
          {
            name: "position_time",
            value: data.position_time ? moment(data.position_time) : null,
          },
          { name: "object", value: data.object },
          { name: "nation", value: data.nation },
          { name: "religion", value: data.religion },
          { name: "role", value: data.role },
          {
            name: "role_time",
            value: data.role_time ? moment(data.role_time) : null,
          },
        ]}
      >
        <Row gutter={[20, 20]}>
          <Col xxl={18} md={16}>
            <PageBody className="m-0">
              <h3>Thông tin cơ bản</h3>
              <Row gutter={[20, 0]} align="middle">
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Họ và tên quân nhân"
                    name="name"
                    rules={[
                      { required: true, message: "Họ và tên là bắt buộc" },
                    ]}
                  >
                    <Input
                      type="text"
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.name}
                      allowClear
                      name="name"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Năm sinh"
                    name="birthday"
                    rules={[
                      { required: true, message: "Năm sinh là bắt buộc" },
                    ]}
                  >
                    <DatePicker
                      picker="year"
                      value={data?.birthday}
                      disabledDate={(current) =>
                        current && current.year() > new Date().getFullYear()
                      }
                      onChange={(value) => {
                        setData({
                          ...data,
                          birthday: value,
                        });
                      }}
                      placeholder="Chọn năm"
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Quê quán"
                    name="home_town"
                    rules={[
                      { required: true, message: "Quê quán là bắt buộc" },
                    ]}
                  >
                    <Input
                      type="text"
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.home_town}
                      allowClear
                      name="home_town"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Chỗ ở hiện nay"
                    name="current_residence"
                    rules={[
                      { required: true, message: "Chỗ ở hiện nay là bắt buộc" },
                    ]}
                  >
                    <Input
                      type="text"
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.current_residence}
                      allowClear
                      name="current_residence"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Dân tộc"
                    name="nation"
                    rules={[{ required: true, message: "Dân tộc là bắt buộc" }]}
                  >
                    <DebounceSelect
                      value={data?.nation}
                      labelInValue={false}
                      placeholder="Tìm kiếm"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          nation: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={NATION_OPTIONS}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Tôn giáo"
                    name="religion"
                    rules={[
                      { required: true, message: "Tôn giáo là bắt buộc" },
                    ]}
                  >
                    <DebounceSelect
                      labelInValue={false}
                      value={data?.religion}
                      placeholder="Tìm kiếm"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          religion: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={REGILION_OPTIONS}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </PageBody>
            <PageBody className="m-0">
              <h3>Thông tin cấp bậc</h3>
              <Row gutter={[20, 0]} align="middle">
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Đối tượng"
                    name="object"
                    rules={[
                      { required: true, message: "Đối tượng là bắt buộc" },
                    ]}
                  >
                    <DebounceSelect
                      labelInValue={false}
                      value={data?.object}
                      placeholder="Tìm kiếm"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          object: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={OBJECT_OPTIONS}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Cấp bậc"
                    name="role"
                    rules={[{ required: true, message: "Cấp bậc là bắt buộc" }]}
                  >
                    <DebounceSelect
                      value={data?.role}
                      labelInValue={false}
                      placeholder="Tìm kiếm"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          role: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={ROLE_OPTIONS}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Thời gian lên cấp"
                    name="role_time"
                    rules={[
                      {
                        required: true,
                        message: "Thời gian lên cấp là bắt buộc",
                      },
                    ]}
                  >
                    <DatePicker
                      picker="month"
                      value={data?.role_time ?? null}
                      format={"MM/YYYY"}
                      disabledDate={(current) =>
                        current && current.year() > new Date().getFullYear()
                      }
                      onChange={(value) => {
                        setData({
                          ...data,
                          role_time: value,
                        });
                      }}
                      placeholder="Chọn tháng/năm"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Chức vụ"
                    name="position"
                    rules={[{ required: true, message: "Chức vụ là bắt buộc" }]}
                  >
                    <DebounceSelect
                      labelInValue={false}
                      value={data?.position}
                      placeholder="Tìm kiếm"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          position: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={POSITION_OPTIONS}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Thời gian lên chức"
                    name="position_time"
                    rules={[
                      {
                        required: true,
                        message: "Thời gian lên cấp là bắt buộc",
                      },
                    ]}
                  >
                    <DatePicker
                      picker="month"
                      value={data?.position_time}
                      format={"MM/YYYY"}
                      disabledDate={(current) =>
                        current && current.year() > new Date().getFullYear()
                      }
                      onChange={(value) => {
                        setData({
                          ...data,
                          position_time: value,
                        });
                      }}
                      placeholder="Chọn tháng/năm"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </PageBody>
            <PageBody className="m-0">
              <h3>Tình hình chính trị, tư tưởng</h3>
              <Row gutter={[20, 0]} align="middle">
                <Col md={24} xs={24}>
                  <Form.Item label="Quá trình công tác">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.work_progress}
                      name="work_progress"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item label="Khen thưởng">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.reward}
                      name="reward"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item label="Kỷ luật">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.discipline}
                      name="discipline"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Kết quả hoàn thành nhiệm vụ"
                    name="mission_result"
                    rules={[
                      {
                        required: true,
                        message: "Kết quả hoàn thành nhiệm vụ là bắt buộc",
                      },
                    ]}
                  >
                    <DebounceSelect
                      value={data?.mission_result}
                      labelInValue={false}
                      placeholder="Tìm kiếm"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          mission_result: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={MISSION_COMPLETE_OPTIONS}
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item label="Thông tin về gia đình quân nhân">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.family_infomation}
                      name="family_infomation"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item label="Các vấn đề cần quan tâm">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.issues_of_concern}
                      name="issues_of_concern"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item label="" className="m-0">
                    <Checkbox
                      checked={data?.is_care}
                      onChange={(event: any) =>
                        setData({ ...data, is_care: event?.target?.checked })
                      }
                    >
                      Đánh dấu cần được quan tâm
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </PageBody>
          </Col>
          <Col xxl={6} md={8}>
            <PageBody className="m-0" style={{ position: "sticky", top: 20 }}>
              <h3>Thông tin đơn vị</h3>
              <Row gutter={[20, 0]} align="middle">
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Tiểu đoàn"
                    name="battalion_id"
                    rules={[
                      { required: true, message: "Tiểu đoàn là bắt buộc" },
                    ]}
                  >
                    <DebounceSelect
                      value={data?.battalion_id}
                      placeholder="Tìm kiếm"
                      fetchOptions={fetchBattalion}
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          battalion_id: dt,
                          company_id: null,
                          platoon_id: null,
                        });
                        fetchCompany("", dt?.value);
                      }}
                      style={{ width: "100%" }}
                      optionDefault={battalion}
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Đại đội"
                    name="company_id"
                    rules={[{ required: true, message: "Đại đội là bắt buộc" }]}
                  >
                    <DebounceSelect
                      value={data?.company_id}
                      placeholder={
                        isNil(data?.battalion_id)
                          ? "Vui lòng chọn tiểu đoàn trước"
                          : "Tìm kiếm"
                      }
                      fetchOptions={fetchCompany}
                      disabled={isNil(data?.battalion_id)}
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          company_id: dt,
                          platoon_id: null,
                        });
                        fetchPlatoon("", dt?.value);
                      }}
                      style={{ width: "100%" }}
                      optionDefault={company}
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Trung đội"
                    name="platoon_id"
                    rules={[
                      { required: true, message: "Trung đội là bắt buộc" },
                    ]}
                  >
                    <DebounceSelect
                      value={data?.platoon_id}
                      placeholder={
                        isNil(data?.company_id)
                          ? "Vui lòng chọn đại đội trước"
                          : "Tìm kiếm"
                      }
                      fetchOptions={fetchPlatoon}
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          platoon_id: dt,
                        });
                      }}
                      disabled={isNil(data?.company_id)}
                      style={{ width: "100%" }}
                      optionDefault={platoon}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <h3 className="mt-2">Trạng thái</h3>
              <div className="d-flex align-items-center justify-content-between">
                <Checkbox
                  checked={data?.status == 1 ? true : false}
                  onChange={(event: any) =>
                    setData({ ...data, status: event?.target?.checked ? 1 : 0 })
                  }
                >
                  Hoạt động
                </Checkbox>
              </div>
            </PageBody>
          </Col>
        </Row>
      </Form>

      <div className="bottom-action">
        <div className="group__buton">
          <Button
            color="primary"
            className="bilet_button outline ml-2"
            onClick={() => router?.goBack()}
          >
            Hủy
          </Button>
          {!!!id || id === "add" ? (
            <Button
              color="primary"
              className="bilet_button ml-2"
              onClick={handleSubmit}
            >
              Thêm quân nhân
            </Button>
          ) : (
            <Button
              color="primary"
              className="bilet_button ml-2"
              onClick={handleEdit}
            >
              Lưu
            </Button>
          )}
        </div>
      </div>
      {loading && <Loader />}
    </div>
  );
};

const RenderActionModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const { closeModal, action, loadData } = props;
  const router = useHistory();

  return (
    <CardBody className="p-0" style={{ width: 400 }}>
      <div className="modal-header">
        <h5 className="modal-title" id="modal-action-title">
          Thông báo
        </h5>
        <button onClick={() => closeModal()} type="button" className="close">
          {" "}
          <span aria-hidden="true">×</span>{" "}
        </button>
      </div>
      <div className="p-3 pt-4 text-center">
        Bạn có chắc chắn muốn kích hoạt lại đơn hàng{" "}
        <b className="text-danger">{action?.data?.name}</b>
      </div>
      <div className="modal-footer">
        <Button
          onClick={closeModal}
          className="ml-2 success-bland"
          color="success"
          type="button"
        >
          {" "}
          Hủy bỏ
        </Button>
        <Button
          // onClick={handleActive}
          className="ml-2"
          color="success"
          type="button"
        >
          {" "}
          Xác nhận{" "}
        </Button>
      </div>
      {loading && <Loader />}
    </CardBody>
  );
};

export default List;
