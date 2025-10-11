import {
  Avatar,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { isEmpty, startsWith } from "lodash";
import noImage from "../../assets/images/users/no-img.jpg";
import { FileUploader } from "react-drag-drop-files";
import { Button } from "reactstrap";
import { useHistory } from "react-router";
import { useUser } from "../../hooks/useUser";
import TextUtils from "../../helpers/TextUtils";
import { baseUrl } from "../../constants/environment";
import { getBase64, uploadFile } from "../../helpers/UploadUtils";
import APIClient from "../../helpers/APIClient";
import UserManager from "../../manager/UserManager";
import Loader from "../../components/Loader";
import {
  ContractList,
  PositionList,
  SexList,
} from "../../constants/bilet-constant";
import { DebounceSelect } from "../../common/DebounceSelect";

const List = (props: any) => {
  const {
    onlyView,
    onDelete,
    closeModal,
    id,
    loadData,
    place,
    dataDetail,
    onRemoveUser,
    onResetPassword,
  } = props;
  const user = useUser();
  const [loading, setLoading] = useState<any>(false);
  const [data, setData] = useState<any>({});
  const formRef = useRef<any>(null);
  const [roles, setRoles] = useState<any>([]);
  const [imgAvatar, setimgAvatar] = useState<any>(null);
  const router = useHistory();

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    setData(dataDetail);
  }, [dataDetail]);

  console.log("data", data);

  const handleChangeInput = (event?: any) => {
    let { value, name } = event.target;
    if (value === " ") return;
    if (name == "phone") {
      value = TextUtils.onlyNumber(value);
    }
    setData({
      ...data,
      [name]: value,
    });
  };

  const fetchRoles = async (name?: string) => {
    const params: any = {
      name: name ? name : "",
      status: 1,
    };
    if (params?.name === "") delete params?.name;
    const URL = `${baseUrl}/roles`;
    setLoading(true);
    let response: any = await APIClient.GET(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      let List = response.response.data?.map((item: any) => ({
        ...item,
        name: item?.name,
        label: item?.name,
        value: item?.id,
      }));
      setRoles(List);
      return List;
    } else {
      return [];
    }
  };

  const validation = () => {
    if (!isEmpty(data?.email) && !TextUtils.validateEmail(data?.email)) {
      toast.error("Email không đúng định dạng");
      return false;
    }
    if (!isEmpty(data?.phone) && !TextUtils.validatePhone(data?.phone)) {
      toast.error("Số điện thoại không đúng định dạng");
      return false;
    }
    return true;
  };

  console.log("dataxxx", data);

  const handleEdit = async () => {
    await formRef?.current?.validateFields();
    if (!validation()) return;
    const URL = `${baseUrl}/user/${data?.id}`;
    const params: any = {
      ...data,
      roles: data?.roles?.map((e: any) => e?.value),
      birthday: data?.birthday ? moment(data?.birthday).utc() : undefined,
    };
    if (!!imgAvatar) {
      const url_avatar: any = await uploadFile(imgAvatar);
      if (url_avatar && startsWith(url_avatar, "http")) {
        params.avatar = url_avatar;
      } else {
        toast.error("Không thể tải ảnh lên ảnh đại diện");
        return false;
      }
    }
    delete params?.created_time;
    delete params?.created_uid;
    delete params?.updated_time;
    delete params?.permissions;

    setLoading(true);
    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      UserManager._getUserInfo();
      toast.success("Chỉnh sửa nhân viên thành công!");
      if (place === "detail") {
        router?.push(`/user/${data?.id}/view`);
      }
      closeModal && closeModal();
      loadData && loadData();
    }
  };

  const handleSubmit = async () => {
    await formRef?.current?.validateFields();
    if (!validation()) return;
    const URL = `${baseUrl}/user`;
    const params: any = {
      ...data,
      roles: data?.roles?.map((e: any) => e?.value),
    };
    setLoading(true);
    let response: any = await APIClient.POST(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      toast.success("Thêm mới nhân viên thành công!");
      closeModal && closeModal();
      loadData && loadData();
    }
  };

  const _onChangeDate = (date: any) => {
    if (!!!date) return;
    setData({
      ...data,
      birthday: moment(date, "x")?.valueOf(),
    });
  };

  const handleChangeFile = async (file: any) => {
    setLoading(true);
    const imgBase64: any = await getBase64(file);
    setLoading(false);
    if (imgBase64) {
      setData({
        ...data,
        avatar: imgBase64,
      });
    }
    setimgAvatar(file);
  };

  return (
    <Form
      ref={formRef}
      wrapperCol={{ flex: 1 }}
      layout="vertical"
      autoComplete="off"
      className="form_normal"
      fields={[
        { name: "name", value: data?.name },
        { name: "password", value: data?.password },
        { name: "email", value: data?.email },
      ]}
    >
      <div className={place ? "p-3" : "form__box p-3"}>
        <Row gutter={[place ? 50 : 20, 0]}>
          {place && (
            <Col md={24} xs={24}>
              <Form.Item label="" style={{ display: "inline-flex" }}>
                <FileUploader
                  handleChange={(e: any) => {
                    handleChangeFile(e);
                    setimgAvatar(null);
                  }}
                  fileOrFiles={imgAvatar}
                  multiple={false}
                  name="file"
                  types={["JPEG", "JPG", "PNG"]}
                  classes="file-drop-inner upload__file"
                  disabled={onlyView}
                >
                  <Avatar
                    src={data?.avatar || noImage}
                    alt="avatar"
                    style={{ width: 70, height: 70 }}
                  />
                  <div className="icon_upload">
                    <i className="uil-camera-change"></i>
                  </div>
                </FileUploader>
              </Form.Item>
            </Col>
          )}

          <Col md={place ? 12 : 24} xs={24}>
            <Form.Item
              label="Tên nhân viên"
              name={"name"}
              rules={[{ required: true, message: "Tên nhân viên là bắt buộc" }]}
            >
              <Input
                disabled={onlyView}
                onChange={(e: any) => handleChangeInput(e)}
                allowClear
                value={data?.name}
                name="name"
                placeholder="Nhập họ tên nhân viên"
              />
            </Form.Item>
          </Col>
          {place && (
            <Col md={place ? 12 : 24} xs={24}>
              <Form.Item label="Mã nhân viên">
                <div
                  className="d-flex align-items-center"
                  style={{ minHeight: 44, fontSize: 16 }}
                >
                  {data?.code || "---"}
                </div>
              </Form.Item>
            </Col>
          )}
          <Col md={place ? 12 : 24} xs={24}>
            <Form.Item label="Ngày sinh">
              <DatePicker
                disabled={onlyView}
                onChange={_onChangeDate}
                name="birthday"
                placeholder="Chọn ngày sinh"
                format={"DD/MM/YYYY"}
                value={data?.birthday && moment(data?.birthday)}
                allowClear
                suffixIcon={<i className="uil-calendar-alt"></i>}
              />
            </Form.Item>
          </Col>
          <Col md={place ? 12 : 24} xs={24}>
            <Form.Item label="Giới tính">
              <Select
                placeholder="Chọn giới tính"
                onChange={(vl: string) => setData({ ...data, sex: vl })}
                disabled={onlyView}
                value={data?.sex}
                style={{ flex: 1, fontSize: 16 }}
                dropdownStyle={{ minWidth: 200 }}
                allowClear
              >
                {SexList?.map((item: any, index: number) => (
                  <Select.Option key={`sexx_${index}`} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {!place && (
            <Col md={place ? 12 : 24} xs={24}>
              <Form.Item
                label="Mật khẩu"
                name={"password"}
                rules={[{ required: true, message: "Mật khẩu là bắt buộc" }]}
              >
                <Input
                  disabled={onlyView}
                  onChange={(e: any) => handleChangeInput(e)}
                  type="password"
                  allowClear
                  value={data?.password}
                  name="password"
                  placeholder="Nhập mật khẩu"
                />
              </Form.Item>
            </Col>
          )}

          <Col md={place ? 12 : 24} xs={24}>
            <Form.Item
              label="Email"
              name={"email"}
              rules={[{ required: true, message: "Email là bắt buộc" }]}
            >
              <Input
                disabled={onlyView}
                onChange={(e: any) => handleChangeInput(e)}
                allowClear
                name="email"
                value={data?.email}
                placeholder="Nhập Email"
              />
            </Form.Item>
          </Col>
          {place && (
            <Col md={12} xs={24}>
              <Form.Item label="Số điện thoại">
                <Input
                  disabled={onlyView}
                  onChange={(e: any) => handleChangeInput(e)}
                  type="text"
                  allowClear
                  name="phone"
                  value={data?.phone}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>
            </Col>
          )}

          <Col md={place ? 12 : 24} xs={24}>
            <Form.Item label="Chức vụ">
              <Select
                placeholder="Chọn chức vụ"
                onChange={(vl: string) => setData({ ...data, position: vl })}
                disabled={onlyView}
                value={data?.position}
                style={{ flex: 1, fontSize: 16 }}
                dropdownStyle={{ minWidth: 200 }}
                allowClear
              >
                {PositionList?.map((item: any, index: number) => (
                  <Select.Option key={`position${index}`} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={place ? 12 : 24} xs={24}>
            <Form.Item label="Hợp đồng">
              <Select
                placeholder="Chọn hợp đồng"
                onChange={(vl: string) => setData({ ...data, contract: vl })}
                disabled={onlyView}
                value={data?.contract}
                style={{ flex: 1, fontSize: 16 }}
                dropdownStyle={{ minWidth: 200 }}
                allowClear
              >
                {ContractList?.map((item: any, index: number) => (
                  <Select.Option
                    key={`contract_${index}`}
                    value={item.value}
                    id={item.value}
                  >
                    {item.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col md={place ? 12 : 24} xs={24}>
            <Form.Item label="Phân quyền">
              <DebounceSelect
                labelInValue={true}
                mode="multiple"
                value={data?.roles}
                placeholder="Tìm kiếm phân quyền"
                fetchOptions={fetchRoles}
                onChange={(dt: any) => setData({ ...data, roles: dt })}
                style={{ width: "100%" }}
                optionDefault={roles}
                onlyView={place == "sale_member" ? false : onlyView}
              />
            </Form.Item>
          </Col>
        </Row>
        {place && (
          <div className="mt-3 d-flex align-items-center justify-content-between">
            <Checkbox
              checked={data?.status == 1 ? true : false}
              disabled={onlyView}
              onChange={(event: any) =>
                setData({ ...data, status: event?.target?.checked ? 1 : 0 })
              }
            >
              Hoạt động
            </Checkbox>
          </div>
        )}
      </div>
      {place !== "sale_member" && (
        <div className={place ? "bottom-action" : "p-3"}>
          <div className="group_button d-flex justify-content-center">
            {onlyView ? (
              <>
                <Button
                  onClick={() => onResetPassword(data)}
                  className="ml-2 bilet_button outline danger"
                  type="button"
                >
                  Reset mật khẩu
                </Button>
                <Button
                  onClick={() => onDelete(data)}
                  className="ml-2 bilet_button outline danger"
                  type="button"
                >
                  Xóa tài khoản
                </Button>
              </>
            ) : (
              <Button
                onClick={closeModal}
                className="ml-2 bilet_button outline"
                type="button"
              >
                Hủy
              </Button>
            )}
            {!!!id ? (
              <Button
                onClick={handleSubmit}
                className="ml-2 bilet_button"
                type="button"
              >
                Thêm mới
              </Button>
            ) : onlyView ? (
              <Button
                onClick={() => router?.push(`/user/${id}`)}
                className="ml-2 bilet_button"
                type="button"
              >
                Chỉnh sửa thông tin
              </Button>
            ) : (
              <Button
                onClick={handleEdit}
                className="ml-2 bilet_button"
                type="button"
              >
                Lưu lại
              </Button>
            )}
          </div>
        </div>
      )}
      {place === "sale_member" && (
        <div className={place ? "bottom-action" : "p-3"}>
          <div className="group_button d-flex justify-content-center">
            <Button
              onClick={() => onRemoveUser()}
              className="ml-2 bilet_button outline danger"
              type="button"
            >
              Xóa khỏi nhóm
            </Button>
            <Button
              onClick={handleEdit}
              className="ml-2 bilet_button"
              type="button"
            >
              Lưu lại
            </Button>
          </div>
        </div>
      )}
      {loading && <Loader />}
    </Form>
  );
};
export default List;
