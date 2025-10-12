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
import { Battalion } from "../battalion/BattalionList";
import { DebounceSelect } from "../../../common/DebounceSelect";

interface IDetailProps {
  dataProps: ActionModal;
  closeModal?: () => void;
  loadData?: () => void;
}

const List = (props: IDetailProps) => {
  const { closeModal, loadData, dataProps } = props;
  const [loading, setLoading] = useState<any>(false);
  const [data, setData] = useState<any>({});
  const [battalion, setBattalion] = useState<Battalion[]>([]);
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

  const fetchDataDetail = async () => {
    const URL = `${baseUrl}/company/${dataProps?.data?.id}`;
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
    const URL = `${baseUrl}/company/${data?.id}`;
    const params: any = {
      name: data?.name,
      battalion_id: data?.battalion_id?.value,
    };
    setLoading(true);
    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      UserManager._getUserInfo();
      toast.success("Chỉnh sửa đại đội thành công!");
      closeModal && closeModal();
      loadData && loadData();
    }
  };

  const handleSubmit = async () => {
    await formRef?.current?.validateFields();
    const URL = `${baseUrl}/company`;
    const params: any = {
      ...data,
      battalion_id: data?.battalion_id?.value,
    };
    setLoading(true);
    let response: any = await APIClient.POST(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      toast.success("Thêm mới đại đội thành công!");
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
        { name: "battalion_id", value: data?.battalion_id },
      ]}
    >
      <div className={"form__box p-3"}>
        <Row gutter={[20, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Tên đại đội"
              name={"name"}
              rules={[{ required: true, message: "Tên đại đội là bắt buộc" }]}
            >
              <Input
                onChange={(e: any) => handleChangeInput(e)}
                allowClear
                value={data?.name}
                name="name"
                placeholder="Nhập tên đại đội"
              />
            </Form.Item>
            <Form.Item
              label="Tiểu đoàn"
              name={"battalion_id"}
              rules={[{ required: true, message: "Tiểu đoàn là bắt buộc" }]}
            >
              <DebounceSelect
                value={data?.battalion_id}
                placeholder="Tìm kiếm"
                fetchOptions={fetchBattalion}
                onChange={(dt: any) => setData({ ...data, battalion_id: dt })}
                style={{ width: "100%" }}
                optionDefault={battalion}
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
