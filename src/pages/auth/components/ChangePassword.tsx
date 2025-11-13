import { Button, Col, Form, Input, Row } from "antd";
import { useState } from "react";
import UserManager from "../../../manager/UserManager";
import { baseUrl } from "../../../constants/environment";
import APIClient from "../../../helpers/APIClient";
import { toast } from "react-toastify";
import Loader from "../../../components/Loader";
import { useForm } from "antd/lib/form/Form";
import React from "react";
import { useHistory } from "react-router";

const List = (props: any) => {
  const { onClose } = props;
  const [loading, setLoading] = useState<any>(false);
  const [data, setData] = useState<any>({});
  const [formRef] = useForm();
  const route = useHistory();

  const handleChangeInput = (event?: any) => {
    let { value, name } = event.target;
    if (value === " ") return;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    await formRef?.validateFields();
    if (data?.newpassword !== data?.repassword) {
      toast.error("Mật khẩu mới và mật khẩu nhập lại không trùng khớp");
      return;
    }
    setLoading(true);
    const URL = `${baseUrl}/auth/change-password`;
    const params: any = {
      ...data,
    };
    delete params?.repassword;
    let response: any = await APIClient.POST(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      onClose?.();
      toast.success("Thay đổi mật khẩu thành công! Vui lòng đăng nhập lại");
      route?.push("/account/logout");
    }
  };
  return (
    <Form
      form={formRef}
      wrapperCol={{ flex: 1 }}
      layout="vertical"
      autoComplete="off"
      className="form_normal"
      fields={[
        { name: "password", value: data.password },
        { name: "repassword", value: data.repassword },
        { name: "newpassword", value: data.newpassword },
      ]}
    >
      <Row gutter={[50, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            label="Mật khẩu cũ"
            name={"name"}
            rules={[{ required: true, message: "Mật khẩu cũ là bắt buộc" }]}
          >
            <Input
              onChange={(e: any) => handleChangeInput(e)}
              allowClear
              value={data?.password}
              name="password"
              placeholder="Nhập mật khẩu cũ"
              type="password"
            />
          </Form.Item>
        </Col>
        <Col md={24} xs={24}>
          <Form.Item
            label="Nhập mật khẩu mới"
            name={"newpassword"}
            rules={[{ required: true, message: "Mật khẩu mới là bắt buộc" }]}
          >
            <Input
              onChange={(e: any) => handleChangeInput(e)}
              allowClear
              value={data?.newpassword}
              name="newpassword"
              placeholder="Nhập mật khẩu mới"
              type="password"
            />
          </Form.Item>
        </Col>
        <Col md={24} xs={24}>
          <Form.Item
            label="Nhập lại mật khẩu"
            name={"repassword"}
            rules={[
              { required: true, message: "Mật khẩu nhập lại là bắt buộc" },
            ]}
          >
            <Input
              onChange={(e: any) => handleChangeInput(e)}
              allowClear
              value={data?.repassword}
              name="repassword"
              placeholder="Nhập lại mật khẩu mới"
              type="password"
            />
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

