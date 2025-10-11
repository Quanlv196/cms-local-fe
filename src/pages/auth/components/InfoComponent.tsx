import { Button, Col, Form, Input, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import TextUtils from "../../../helpers/TextUtils";
import UserManager from "../../../manager/UserManager";
import moment from "moment";
import { useUser } from "../../../hooks/useUser";
import { baseUrl } from "../../../constants/environment";
import APIClient from "../../../helpers/APIClient";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { isEmpty } from "lodash";

const List = (props: any) => {
  const user = useUser();
  const [loading, setLoading] = useState<any>(false);
  const [data, setData] = useState<any>({});
  const formRef = useRef<any>(null);
  const [imgAvatar, setimgAvatar] = useState<any>(null);
  useEffect(() => {
    setData({
      ...user,
      birthday: moment(user?.birthday)?.valueOf(),
    });
  }, [user]);
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

  const _onChangeDate = (date: any) => {
    setData({
      ...data,
      birthday: date ? moment(date).valueOf() : null,
    });
  };

  const updateStatus = async () => {
    const URL = `${baseUrl}/user/${data?.id}`;
    const params: any = {
      status: data?.status,
    };
    setLoading(true);
    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
    }
  };

  const handleSubmit = async () => {
    await formRef?.current?.validateFields();
    setLoading(true);
    if (!validation()) return;
    const URL = `${baseUrl}/auth/me`;
    const params: any = {
      name: data?.name,
      email: data?.email,
      phone: data?.phone,
    };

    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      UserManager._getUserInfo();
      toast.success("Chỉnh sửa thông tin thành công!");
    }
  };
  return (
    <Form
      ref={formRef}
      wrapperCol={{ flex: 1 }}
      layout="vertical"
      autoComplete="off"
      className="form_normal"
      fields={[
        { name: "name", value: data.name },
        { name: "email", value: data.email },
      ]}
    >
      <Row gutter={[50, 0]}>
        <Col md={12} xs={24}>
          <Form.Item
            label="Họ và tên"
            name={"name"}
            rules={[{ required: true, message: "Họ và tên là bắt buộc" }]}
          >
            <Input
              onChange={(e: any) => handleChangeInput(e)}
              allowClear
              value={data?.name}
              name="name"
              placeholder="Nhập họ tên"
            />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item
            label="Email"
            name={"email"}
            rules={[{ required: true, message: "Email là bắt buộc" }]}
          >
            <Input
              onChange={(e: any) => handleChangeInput(e)}
              allowClear
              name="email"
              value={data?.email}
              placeholder="Nhập Email"
            />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item label="Số điện thoại">
            <Input
              onChange={(e: any) => handleChangeInput(e)}
              type="text"
              allowClear
              name="phone"
              value={data?.phone}
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>
        </Col>
        <Col md={12} xs={24}>
          <Form.Item label="Ngày tạo">
            <div
              className="d-flex align-items-center"
              style={{ fontSize: 16, minHeight: 44 }}
            >
              {moment(data?.created_time).format("DD/MM/YYYY HH:mm")}
            </div>
          </Form.Item>
        </Col>
      </Row>
      <div className="mt-3 d-flex align-items-center justify-content-center">
        <Button className="bilet_button" onClick={handleSubmit}>
          Lưu
        </Button>
      </div>
      {loading && <Loader />}
    </Form>
  );
};
export default List;
