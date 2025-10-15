import { Col, Form, Input, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import TextUtils from "../../../helpers/TextUtils";
import { baseUrl } from "../../../constants/environment";
import APIClient from "../../../helpers/APIClient";
import UserManager from "../../../manager/UserManager";
import Loader from "../../../components/Loader";
import { ActionModal } from "../../../interfaces/common.interface";
import { DebounceSelect } from "../../../common/DebounceSelect";
import { Company } from "../company/CompanyList";
import { Platoon } from "./PlatoonList";

interface IDetailProps {
  dataProps: ActionModal;
  closeModal?: () => void;
  loadData?: () => void;
}

const List = (props: IDetailProps) => {
  const { closeModal, loadData, dataProps } = props;
  const [loading, setLoading] = useState<any>(false);
  const [data, setData] = useState<Platoon>({});
  const [company, setCompany] = useState<Company[]>([]);
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

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async (name?: string) => {
    const URL = `${baseUrl}/company`;
    const response: any = await APIClient.GET(URL, { name });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setCompany(response.response?.data);
    }
  };

  const fetchDataDetail = async () => {
    const URL = `${baseUrl}/platoon/${dataProps?.data?.id}`;
    setLoading(true);
    const response: any = await APIClient.GET(URL);
    setLoading(false);
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setData(response.response);
    }
  };

  const handleEdit = async () => {
    await formRef?.current?.validateFields();
    const URL = `${baseUrl}/platoon/${data?.id}`;
    const params: any = {
      name: data?.name,
      company_id: data?.company_id?.value,
    };
    setLoading(true);
    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      UserManager._getUserInfo();
      toast.success("Chỉnh sửa trung đội thành công!");
      closeModal && closeModal();
      loadData && loadData();
    }
  };

  const handleSubmit = async () => {
    await formRef?.current?.validateFields();
    const URL = `${baseUrl}/platoon`;
    const params: any = {
      ...data,
      company_id: data?.company_id?.value,
    };
    setLoading(true);
    let response: any = await APIClient.POST(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      toast.success("Thêm mới trung đội thành công!");
      closeModal && closeModal();
      loadData && loadData();
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
        { name: "name", value: data?.name },
        { name: "company_id", value: data?.company_id },
      ]}
    >
      <div className={"form__box p-3"}>
        <Row gutter={[20, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Tên trung đội"
              name={"name"}
              rules={[{ required: true, message: "Tên trung đội là bắt buộc" }]}
            >
              <Input
                onChange={(e: any) => handleChangeInput(e)}
                allowClear
                value={data?.name}
                name="name"
                placeholder="Nhập tên trung đội"
              />
            </Form.Item>
            <Form.Item
              label="Đại đội"
              name={"company_id"}
              rules={[{ required: true, message: "Đại đội là bắt buộc" }]}
            >
              <DebounceSelect
                value={data?.company_id}
                placeholder="Tìm kiếm"
                fetchOptions={fetchCompany}
                onChange={(dt: any) => setData({ ...data, company_id: dt })}
                style={{ width: "100%" }}
                optionDefault={company}
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
