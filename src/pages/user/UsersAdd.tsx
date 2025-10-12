import { Checkbox, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { baseUrl } from "../../constants/environment";
import APIClient from "../../helpers/APIClient";
import UserManager from "../../manager/UserManager";
import Loader from "../../components/Loader";
import { useForm } from "antd/lib/form/Form";
import { Platoon } from "../configs/platoon/PlatoonList";
import { Company } from "../configs/company/CompanyList";
import { Battalion } from "../configs/battalion/BattalionList";
import { DebounceSelect } from "../../common/DebounceSelect";
import { IBaseOptions } from "../../interfaces/common.interface";

interface IUser extends IBaseOptions {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  status?: number;
  company_id?: Company | null;
  platoon_id?: Platoon | null;
  battalion_id?: Battalion | null;
}

const List = (props: any) => {
  const { closeModal, loadData, dataProps } = props;
  const [loading, setLoading] = useState<any>(false);
  const [data, setData] = useState<IUser>({ status: 1 });
  const [form] = useForm();
  const [platoon, setPlatoon] = useState<Platoon[]>([]);
  const [company, setCompany] = useState<Company[]>([]);
  const [battalion, setBattalion] = useState<Battalion[]>([]);

  useEffect(() => {
    fetchPlatoon();
    fetchCompany();
    fetchBattalion();
  }, []);

  const fetchPlatoon = async (name?: string, company_id?: number) => {
    const URL = `${baseUrl}/platoon`;
    const response: any = await APIClient.GET(URL, { name, company_id });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setPlatoon(response.response?.data);
    }
  };

  const fetchCompany = async (name?: string, battalion_id?: number) => {
    const URL = `${baseUrl}/company`;
    const response: any = await APIClient.GET(URL, { name, battalion_id });
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      setCompany(response.response?.data);
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

  useEffect(() => {
    if (dataProps?.data?.id) {
      fetchDataDetail();
    }
  }, [dataProps]);

  const fetchDataDetail = async () => {
    const URL = `${baseUrl}/user/${dataProps?.data?.id}`;
    setLoading(true);
    const response: any = await APIClient.GET(URL);
    setLoading(false);
    if (response.error) {
      toast.error(response.error.error_description);
    } else if (response.response) {
      const res = response.response;
      setData({
        ...res,
        platoon_id: res?.platoon,
        company_id: res?.company,
        battalion_id: res?.battalion,
      });
    }
  };

  const handleChangeInput = (event?: any) => {
    let { value, name } = event.target;
    if (name === "username") {
      value = value.replace(/\s+/g, "");
    }
    if (value === " ") return;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleEdit = async () => {
    await form?.validateFields();
    const URL = `${baseUrl}/user/${data?.id}`;
    const params: any = {
      name: data?.name,
      username: data?.username,
      password: data?.password,
      platoon_id: data?.platoon_id?.value ?? null,
      company_id: data?.company_id?.value ?? null,
      battalion_id: data?.battalion_id?.value ?? null,
    };

    setLoading(true);
    let response: any = await APIClient.PUT(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      UserManager._getUserInfo();
      toast.success("Chỉnh sửa tài khoản thành công!");
      closeModal?.();
      loadData?.();
    }
  };

  const handleSubmit = async () => {
    await form?.validateFields();
    const URL = `${baseUrl}/user`;
    const params: any = {
      ...data,
      platoon_id: data?.platoon_id?.value ?? null,
      company_id: data?.company_id?.value ?? null,
      battalion_id: data?.battalion_id?.value ?? null,
    };
    setLoading(true);
    let response: any = await APIClient.POST(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      toast.success("Thêm mới tài khoản thành công!");
      closeModal?.();
      loadData?.();
    }
  };

  return (
    <Form
      form={form}
      wrapperCol={{ flex: 1 }}
      layout="vertical"
      autoComplete="off"
      className="form_normal"
      fields={[
        { name: "password", value: data?.password },
        { name: "username", value: data?.username },
      ]}
    >
      <div className={"form__box p-3"}>
        <Form.Item
          label="Tên đăng nhập"
          name={"username"}
          rules={[{ required: true, message: "Tên đăng nhập là bắt buộc" }]}
        >
          <Input
            onChange={(e: any) => handleChangeInput(e)}
            allowClear
            value={data?.username}
            name="username"
            placeholder="Nhập tên đăng nhập"
          />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name={"password"}
          rules={[
            {
              required: dataProps?.type !== "edit",
              message: "Mật khẩu là bắt buộc",
            },
          ]}
        >
          <Input
            onChange={(e: any) => handleChangeInput(e)}
            type="password"
            allowClear
            value={data?.password}
            name="password"
            placeholder="Nhập mật khẩu"
          />
        </Form.Item>
        <Form.Item label="Tên người dùng">
          <Input
            onChange={(e: any) => handleChangeInput(e)}
            allowClear
            value={data?.name}
            name="name"
            placeholder="Nhập tên người dùng"
          />
        </Form.Item>
        <div className="note mb-2 text-danger">
          <i>Lưu ý: Dữ liệu bên dưới phục vụ phân quyền xem dữ liệu.</i>
        </div>
        <Form.Item label="Tiểu đoàn">
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
        <Form.Item label="Đại đội">
          <DebounceSelect
            value={data?.company_id}
            placeholder="Tìm kiếm"
            fetchOptions={fetchCompany}
            onChange={(dt: any) => {
              setData({ ...data, company_id: dt, platoon_id: null });
              fetchPlatoon("", dt?.value);
            }}
            style={{ width: "100%" }}
            optionDefault={company}
          />
        </Form.Item>
        <Form.Item label="Trung đội">
          <DebounceSelect
            value={data?.platoon_id}
            placeholder="Tìm kiếm"
            fetchOptions={fetchPlatoon}
            onChange={(dt: any) => setData({ ...data, platoon_id: dt })}
            style={{ width: "100%" }}
            optionDefault={platoon}
          />
        </Form.Item>
        <div className="mt-3 d-flex align-items-center justify-content-between">
          <Checkbox
            checked={data?.status == 1 ? true : false}
            onChange={(event: any) =>
              setData({ ...data, status: event?.target?.checked ? 1 : 0 })
            }
          >
            Hoạt động
          </Checkbox>
        </div>
      </div>
      <div className={"p-3"}>
        <div className="group_button d-flex justify-content-center">
          <Button
            onClick={closeModal}
            className="ml-2 bilet_button outline"
            type="button"
          >
            Hủy
          </Button>
          {!!!dataProps?.data?.id ? (
            <Button
              onClick={handleSubmit}
              className="ml-2 bilet_button"
              type="button"
            >
              Thêm mới
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
      {loading && <Loader />}
    </Form>
  );
};
export default List;
