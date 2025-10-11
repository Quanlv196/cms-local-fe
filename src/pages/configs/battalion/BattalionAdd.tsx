import { Col, Form, Input, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import TextUtils from "../../../helpers/TextUtils";
import { baseUrl } from "../../../constants/environment";
import APIClient from "../../../helpers/APIClient";
import UserManager from "../../../manager/UserManager";
import Loader from "../../../components/Loader";
import { ActionModal } from "../../../interfaces/common.interface";

interface IDetailProps {
  dataProps: ActionModal;
  closeModal?: () => void;
  loadData?: () => void;
}

const List = (props: IDetailProps) => {
  const { closeModal, loadData, dataProps } = props;
  const [loading, setLoading] = useState<any>(false);
  const [data, setData] = useState<any>({});
  const formRef = useRef<any>(null);

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

  useEffect(() => {
    if (dataProps?.data) {
      fetchDataDetail();
    }
  }, [dataProps?.data]);

  const fetchDataDetail = async () => {
    const URL = `${baseUrl}/battalion/${dataProps?.data?.id}`;
    setLoading(true);
    const response: any = await APIClient.GET(URL);
    setLoading(false);
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setData(response.response);
    }
  };

  console.log("dataxxx", data);

  const handleEdit = async () => {
    await formRef?.current?.validateFields();
    const URL = `${baseUrl}/battalion/${data?.id}`;
    const params: any = {
      name: data?.name,
    };
    setLoading(true);
    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      UserManager._getUserInfo();
      toast.success("Chỉnh sửa tiểu đoàn thành công!");
      closeModal && closeModal();
      loadData && loadData();
    }
  };

  const handleSubmit = async () => {
    await formRef?.current?.validateFields();
    const URL = `${baseUrl}/battalion`;
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
      toast.success("Thêm mới tiểu đoàn thành công!");
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

  return (
    <Form
      ref={formRef}
      wrapperCol={{ flex: 1 }}
      layout="vertical"
      autoComplete="off"
      className="form_normal"
      fields={[{ name: "name", value: data?.name }]}
    >
      <div className={"form__box p-3"}>
        <Row gutter={[20, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Tên tiểu đoàn"
              name={"name"}
              rules={[{ required: true, message: "Tên tiểu đoàn là bắt buộc" }]}
            >
              <Input
                onChange={(e: any) => handleChangeInput(e)}
                allowClear
                value={data?.name}
                name="name"
                placeholder="Nhập tên tiểu đoàn"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
      <div className={"pb-3"}>
        <div className="group_button d-flex justify-content-center">
          {dataProps?.type === "edit" ? (
            <Button onClick={handleEdit} className="bilet_button" type="button">
              Lưu lại
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bilet_button"
              type="button"
            >
              Thêm mới
            </Button>
          )}
        </div>
      </div>
      {loading && <Loader />}
    </Form>
  );
};
export default List;
