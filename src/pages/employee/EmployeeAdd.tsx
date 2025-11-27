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
  CARE_OPTIONS,
  NATION_OPTIONS,
  OBJECT_OPTIONS,
  PositionByObjectTypeLabel,
  REGILION_OPTIONS,
  RoleByObjectTypeLabel,
  SCHOOL_OPTIONS,
} from "../../constants/app.constant";
import { Battalion } from "../configs/battalion/BattalionList";
import { Company } from "../configs/company/CompanyList";
import { Platoon } from "../configs/platoon/PlatoonList";
import EditorComponent from "../../common/EditorComponent";
import { isEmpty, isNil } from "lodash";
import DataUtils from "../../helpers/DataUtils";
import moment from "moment";
import ObjectType from "../../constants/app.enum";
import { FileUploader } from "react-drag-drop-files";
import { getBase64, getURLImage, uploadFile } from "../../helpers/UploadUtils";
import NotFound from "../dashboard/NotFound";

interface Props {
  history: any;
  location: any;
  match: any;
  user: any;
}

export interface IAddress {
  code: string;
  name: string;
  full_name: string;
}

const List: React.FC<Props> = (props: any) => {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [data, setData] = useState<any>({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState();
  const [titlePage, setTilePage] = useState("");
  const [battalion, setBattalion] = useState<Battalion[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [platoon, setPlatoon] = useState<Platoon[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const [provinces, setProvinces] = useState<IAddress[]>([]);
  const [wards, setWards] = useState<IAddress[]>([]);
  const [currentResidenceWards, setCurrentResidenceWards] = useState<
    IAddress[]
  >([]);

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
    fetchProvinces();
  }, []);

  const fetchProvinces = async (name?: string) => {
    const URL = `${baseUrl}/address/provinces`;
    const response: any = await APIClient.GET(URL, { name, limit: 100 });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setProvinces(response.response?.data);
    }
  };

  const fetchWards = async (name?: string, provinceCode?: string) => {
    const province_code = provinceCode ?? data?.home_town_province_code;
    const URL = `${baseUrl}/address/wards`;
    const response: any = await APIClient.GET(URL, {
      name,
      province_code,
    });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setWards(response.response?.data);
    }
  };

  const fetchCurrentResidenceWards = async (
    name?: string,
    provinceCode?: string
  ) => {
    const province_code = provinceCode ?? data?.current_residence_province_code;
    const URL = `${baseUrl}/address/wards`;
    const response: any = await APIClient.GET(URL, {
      name,
      province_code,
    });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setCurrentResidenceWards(response.response?.data);
    }
  };

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
      setIsNotFound(true);
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
      fetchWards("", resData?.home_town_province_code);
      fetchCurrentResidenceWards("", resData?.current_residence_province_code);
    }
  };

  if (isNotFound) {
    return <NotFound />;
  }

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
        provinces={provinces}
        fetchProvinces={fetchProvinces}
        wards={wards}
        fetchWards={fetchWards}
        currentResidenceWards={currentResidenceWards}
        fetchCurrentResidenceWards={fetchCurrentResidenceWards}
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
    provinces,
    fetchProvinces,
    wards,
    fetchWards,
    currentResidenceWards,
    fetchCurrentResidenceWards,
  } = props;
  const [loading, setLoading] = useState(false);
  const router = useHistory();
  const formRef = useRef<any>(null);
  const [imgAvatar, setImgAvatar] = useState<any>(null);

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
      care_infomation: data?.care_infomation || [],
      birthday: moment(data?.birthday).valueOf(),
      position_time: data?.position_time
        ? moment(data?.position_time).valueOf()
        : undefined,
      role_time: data?.role_time
        ? moment(data?.role_time).valueOf()
        : undefined,
      join_party_date: data?.join_party_date
        ? moment(data?.join_party_date).valueOf()
        : undefined,
      join_union_date: data?.join_union_date
        ? moment(data?.join_union_date).valueOf()
        : undefined,
    });
    const fields = ["excellent_year", "good_year", "success_year", "fail_year"];

    fields.forEach((field) => {
      if (params?.[field] === "<p></p>" || params?.[field] === "<p></p>\n") {
        params[field] = null;
      }
    });
    if (!!imgAvatar) {
      const url_avatar: any = await uploadFile(imgAvatar);
      if (url_avatar) {
        params.image = url_avatar;
      } else {
        toast.error("Không thể tải ảnh lên ảnh đại diện");
        return false;
      }
    }
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
      care_infomation: data?.care_infomation || [],
      birthday: moment(data?.birthday).valueOf(),
      position_time: data?.position_time
        ? moment(data?.position_time).valueOf()
        : undefined,
      role_time: data?.role_time
        ? moment(data?.role_time).valueOf()
        : undefined,
      join_party_date: data?.join_party_date
        ? moment(data?.join_party_date).valueOf()
        : undefined,
      join_union_date: data?.join_union_date
        ? moment(data?.join_union_date).valueOf()
        : undefined,
    });
    if (!!imgAvatar) {
      const url_avatar: any = await uploadFile(imgAvatar);
      if (url_avatar) {
        params.image = url_avatar;
      } else {
        toast.error("Không thể tải ảnh lên ảnh đại diện");
        return false;
      }
    }
    const fields = ["excellent_year", "good_year", "success_year", "fail_year"];

    fields.forEach((field) => {
      if (params?.[field] === "<p></p>" || params?.[field] === "<p></p>\n") {
        params[field] = null;
      }
    });
    setLoading(true);
    delete params?.code;
    delete params?.created_time;
    delete params?.created_uid;
    delete params?.id;
    delete params?.updated_time;
    delete params?.updated_uid;
    delete params?.home_town_ward;
    delete params?.home_town_province;
    delete params?.current_residence_province;
    delete params?.current_residence_ward;
    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      toast.success("Chỉnh sửa quân nhân thành công");
      router?.push(`/employee/list`);
    }
  };

  console.log("dataxxx", data);

  const handleChangeFile = async (file: any, type: string) => {
    setLoading(true);
    const imgBase64: any = await getBase64(file);
    setLoading(false);
    if (imgBase64) {
      setData({
        ...data,
        [type]: imgBase64,
      });
    }
    setImgAvatar(file);
  };

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
          { name: "platoon_id", value: data.platoon_id },
          { name: "battalion_id", value: data.battalion_id },
          { name: "object", value: data.object },
          { name: "nation", value: data.nation },
          { name: "religion", value: data.religion },
          { name: "role", value: data.role },
        ]}
      >
        <Row gutter={[20, 20]}>
          <Col xxl={18} md={16}>
            <PageBody className="m-0">
              <h3>Thông tin cơ bản</h3>
              <Row>
                <Col>
                  <Form.Item label="Ảnh quân nhân">
                    <div className="mb-2">
                      {data.image && (
                        <div className="book__image mt-3">
                          <img src={getURLImage(data.image)} alt="Ảnh cover" />
                          <div
                            className="icon_delete"
                            onClick={() => {
                              setData({ ...data, image: null });
                              setImgAvatar(null);
                            }}
                          >
                            <i className="uil-trash-alt"></i>
                          </div>
                        </div>
                      )}
                    </div>
                    <FileUploader
                      handleChange={(e: any) => {
                        handleChangeFile(e, "image");
                        setImgAvatar(null);
                      }}
                      fileOrFiles={imgAvatar}
                      multiple={false}
                      name="image"
                      types={["JPEG", "JPG", "PNG"]}
                      classes="file-drop-inner upload__file"
                    >
                      <div>
                        {!data.image ? (
                          <Button
                            color="primary"
                            className="bilet_button outline"
                          >
                            <i className="uil-upload"></i> Tải lên ảnh
                          </Button>
                        ) : (
                          <Button
                            color="primary"
                            className="bilet_button outline"
                          >
                            <i className="uil-refresh"></i> Thay đổi ảnh
                          </Button>
                        )}
                      </div>
                    </FileUploader>
                  </Form.Item>
                </Col>
              </Row>
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
                <Col md={12} xs={24}>
                  <Form.Item label="Tỉnh/Thành phố (Quê quán)">
                    <DebounceSelect
                      value={data?.home_town_province_code}
                      labelInValue={false}
                      fetchOptions={fetchProvinces}
                      placeholder="Tìm kiếm Tỉnh/TP"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          home_town_province_code: dt,
                          home_town_ward_code: null,
                        });
                        fetchWards("", dt);
                      }}
                      style={{ width: "100%" }}
                      optionDefault={provinces}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item label="Xã/Phường (Quê quán)">
                    <DebounceSelect
                      value={data?.home_town_ward_code}
                      disabled={isEmpty(data?.home_town_province_code)}
                      labelInValue={false}
                      fetchOptions={fetchWards}
                      optionMerge={[data?.home_town_ward]}
                      placeholder={
                        data?.home_town_province_code
                          ? "Tìm kiếm Xã/Phường"
                          : "Vui lòng chọn Tỉnh/TP trước"
                      }
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          home_town_ward_code: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={wards}
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item label="Địa chỉ chi tiết (Quê quán)">
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
                <Col md={12} xs={24}>
                  <Form.Item label="Tỉnh/Thành phố (Chỗ ở hiện nay)">
                    <DebounceSelect
                      value={data?.current_residence_province_code}
                      labelInValue={false}
                      fetchOptions={fetchProvinces}
                      placeholder="Tìm kiếm Tỉnh/TP"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          current_residence_province_code: dt,
                          current_residence_ward_code: null,
                        });
                        fetchCurrentResidenceWards("", dt);
                      }}
                      style={{ width: "100%" }}
                      optionDefault={provinces}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item label="Xã/Phường (Chỗ ở hiện nay)">
                    <DebounceSelect
                      value={data?.current_residence_ward_code}
                      disabled={isEmpty(data?.current_residence_province_code)}
                      labelInValue={false}
                      fetchOptions={fetchCurrentResidenceWards}
                      optionMerge={[data?.current_residence_ward]}
                      placeholder={
                        data?.current_residence_province_code
                          ? "Tìm kiếm Xã/Phường"
                          : "Vui lòng chọn Tỉnh/TP trước"
                      }
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          current_residence_ward_code: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={currentResidenceWards}
                    />
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <Form.Item label="Địa chỉ chi tiết (Chỗ ở hiện nay)">
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
                <Col md={24} xs={24}>
                  <Form.Item label="Trường đào tạo">
                    <DebounceSelect
                      labelInValue={false}
                      value={data?.school}
                      placeholder="Tìm kiếm"
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          school: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={SCHOOL_OPTIONS}
                    />
                  </Form.Item>
                </Col>
              </Row>
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
                          role: null,
                          position: null,
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
                      disabled={isEmpty(data?.object)}
                      value={data?.role}
                      labelInValue={false}
                      placeholder={
                        isEmpty(data?.object)
                          ? "Vui lòng chọn đối tượng trước"
                          : "Chọn cấp bậc"
                      }
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          role: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={
                        RoleByObjectTypeLabel?.[data?.object as ObjectType] ||
                        []
                      }
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item label="Thời gian phong/thăng quân hàm">
                    <DatePicker
                      picker="month"
                      value={data?.role_time ? moment(data?.role_time) : null}
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
                  <Form.Item label="Chức vụ">
                    <DebounceSelect
                      disabled={isEmpty(data?.object)}
                      labelInValue={false}
                      value={data?.position}
                      placeholder={
                        isEmpty(data?.object)
                          ? "Vui lòng chọn đối tượng trước"
                          : "Chọn chức vụ"
                      }
                      onChange={(dt: any) => {
                        setData({
                          ...data,
                          position: dt,
                        });
                      }}
                      style={{ width: "100%" }}
                      optionDefault={
                        PositionByObjectTypeLabel?.[
                          data?.object as ObjectType
                        ] || []
                      }
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item label="Thời gian bổ nhiệm">
                    <DatePicker
                      picker="month"
                      value={
                        data?.position_time ? moment(data?.position_time) : null
                      }
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
              <Row gutter={[20, 0]} align="middle">
                <Col md={12} xs={24}>
                  <Form.Item label="Ngày vào Đoàn">
                    <DatePicker
                      value={
                        data?.join_union_date
                          ? moment(data?.join_union_date)
                          : null
                      }
                      format={"DD/MM/YYYY"}
                      disabledDate={(current) =>
                        current && current > moment().endOf("day")
                      }
                      onChange={(value) => {
                        setData({
                          ...data,
                          join_union_date: value,
                        });
                      }}
                      placeholder="Chọn ngày"
                    />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item label="Ngày vào Đảng">
                    <DatePicker
                      value={
                        data?.join_party_date
                          ? moment(data?.data?.join_party_date)
                          : null
                      }
                      format={"DD/MM/YYYY"}
                      disabledDate={(current) =>
                        current && current > moment().endOf("day")
                      }
                      onChange={(value) => {
                        setData({
                          ...data,
                          join_party_date: value,
                        });
                      }}
                      placeholder="Chọn ngày"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[20, 0]} align="middle">
                <Col xxl={6} md={12}>
                  <Form.Item label="Năm hoàn thành xuất sắc nhiệm vụ">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.excellent_year}
                      name="excellent_year"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col xxl={6} md={12}>
                  <Form.Item label="Năm hoàn thành tốt nhiệm vụ">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.good_year}
                      name="good_year"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col xxl={6} md={12}>
                  <Form.Item label="Năm hoàn thành nhiệm vụ">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.success_year}
                      name="success_year"
                      placeholder="Nhập nội dung"
                    />
                  </Form.Item>
                </Col>
                <Col xxl={6} md={12}>
                  <Form.Item label="Năm không hoàn thành nhiệm vụ">
                    <EditorComponent
                      type="text"
                      rows={2}
                      onChange={(e: any) => handleChangeInput(e)}
                      value={data?.fail_year}
                      name="fail_year"
                      placeholder="Nhập nội dung"
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
                <Col md={12} xs={24}>
                  <Form.Item label="" className="m-0">
                    <Checkbox
                      checked={data?.is_care}
                      onChange={(event: any) =>
                        setData({
                          ...data,
                          is_care: event?.target?.checked,
                          care_infomation: [],
                        })
                      }
                    >
                      Đánh dấu cần được quan tâm
                    </Checkbox>
                  </Form.Item>
                </Col>
                {data?.is_care && (
                  <Col md={12} xs={24}>
                    <Form.Item label="Vấn đề cần quan tâm">
                      <DebounceSelect
                        labelInValue={false}
                        value={data?.care_infomation}
                        mode="multiple"
                        placeholder="Chọn vấn đề"
                        onChange={(dt: any) => {
                          setData({
                            ...data,
                            care_infomation: dt,
                          });
                        }}
                        style={{ width: "100%" }}
                        optionDefault={CARE_OPTIONS}
                      />
                    </Form.Item>
                  </Col>
                )}
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
                  Đang công tác
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

