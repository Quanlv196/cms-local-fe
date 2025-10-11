import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, CardBody } from "reactstrap";
import { Avatar, Form, Tabs } from "antd";
import { baseUrl } from "../../constants/environment";
import APIClient from "../../helpers/APIClient";
import PageTitle from "../../components/PageTitle";
import ModalPopup from "../../components/ModalPopup";
import Loader from "../../components/Loader";
import PageBody from "../../components/PageBody";
import UsersAdd from "./UsersAdd";

interface Props {
  history: any;
  location: any;
  match: any;
  user: any;
}

const List: React.FC<Props> = (props: any) => {
  const { place, idMember, onRemoveUser } = props;
  const router = useHistory();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(props.match.params.id);
  const [onlyView, setOnlyView] = useState(false);
  const [data, setData] = useState<any>({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [type, setType] = useState(props.match.params.action);
  const [action, setAction] = useState();
  const [titlePage, setTilePage] = useState("");

  useEffect(() => {
    if ((id && id !== "add") || idMember) {
      loadData(idMember ? idMember : id);
      if (type === "view") {
        setOnlyView(true);
        document.title = "Chi tiết nhân viên";
        setTilePage("Chi tiết nhân viên");
      } else {
        document.title = "Chỉnh sửa nhân viên";
        setTilePage("Chỉnh sửa nhân viên");
      }
    } else {
      document.title = "Tạo mới nhân viên";
      setTilePage("Tạo mới nhân viên");
    }
  }, [id]);

  const handleActionModal = (item: any) => {
    setAction(item);
    setIsOpen(true);
  };

  const loadData = async (id: number) => {
    const url = `${baseUrl}/user/${id}`;
    setLoading(true);
    let response: any = await APIClient.GET(url);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      const resData: any = response.response;
      setData({
        ...resData,
        roles: resData?.roles?.map((e: any) => {
          return {
            ...e,
            value: e?.id,
            label: e?.name,
          };
        }),
        birthday: resData?.birthday
          ? moment(resData?.birthday).valueOf()
          : null,
      });
    }
  };

  return (
    <React.Fragment>
      {!place && (
        <PageTitle
          title={titlePage}
          breadCrumbItems={[
            { label: "Quản lý nhân viên", path: "/user" },
            { label: titlePage, active: true },
          ]}
        />
      )}

      <ContentPage
        onlyView={onlyView}
        setOnlyView={(val: boolean) => setOnlyView(val)}
        data={data}
        titlePage={titlePage}
        setData={(val: any) => setData(val)}
        id={id}
        handleActionModal={(data: any) => handleActionModal(data)}
        place={place}
        onRemoveUser={onRemoveUser}
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
  const { data, place, onlyView, handleActionModal, onRemoveUser } = props;
  const [loading, setLoading] = useState(false);
  const router = useHistory();
  const formRef = useRef<any>(null);
  const { TabPane } = Tabs;

  return (
    <div className={onlyView ? "detail__page" : "detail__page"}>
      <PageBody>
        <Tabs className="tab__info" defaultActiveKey={"info"}>
          <TabPane tab="Thông tin nhân viên" key="info">
            <Form
              ref={formRef}
              wrapperCol={{ flex: 1 }}
              layout="vertical"
              autoComplete="off"
              className="form_normal"
            >
              <UsersAdd
                dataDetail={data}
                id={data?.id}
                onlyView={onlyView}
                place={place ? place : "detail"}
                onDelete={(val: any) =>
                  handleActionModal({ type: "delete", data: val })
                }
                onResetPassword={(val: any) =>
                  handleActionModal({ type: "reset_password", data: val })
                }
                onRemoveUser={onRemoveUser}
              />
            </Form>
          </TabPane>
        </Tabs>
      </PageBody>
      {loading && <Loader />}
    </div>
  );
};
const RenderActionModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const { closeModal, loadData, action, category, loadDataCount } = props;
  const router = useHistory();

  const handleDelete = async () => {
    const URL = `${baseUrl}/student/${action?.data?.id}`;
    setLoading(true);
    let response: any = await APIClient.DELETE(URL);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      closeModal();
      toast.success("Xóa nhân viên thành công!");
      router?.push(`/bilet/student/list`);
    }
  };

  const handleResetPassword = async () => {
    const URL = `${baseUrl}/auth/me/forgotPassword`;
    const params = {
      email: action?.data?.email,
    };
    setLoading(true);
    let response: any = await APIClient.POST(URL, params);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      closeModal();
      toast.success("Reset mật khẩu thành công. Vui lòng kiểm tra Email!");
    }
  };

  if (action?.type === "reset_password") {
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
                className="uil-sync"
              ></i>
            }
          />
        </div>
        <div className="p-3">
          <h5
            className="text-center"
            style={{ color: "#C12818", fontSize: 24 }}
          >
            Reset mật khẩu
          </h5>
          <p className="text-center" style={{ fontSize: 16 }}>
            Bạn có muốn reset mật khẩu nhân viên{" "}
            <b style={{ color: "#272E35" }}>{`"${action?.data?.name}"`}</b>?
          </p>
        </div>

        <div className="modal-footer">
          <Button
            onClick={handleResetPassword}
            className="ml-2 bilet_button"
            type="button"
          >
            Có
          </Button>
          <Button
            onClick={closeModal}
            className="ml-2 bilet_button outline"
            type="button"
          >
            Không
          </Button>
        </div>
        {loading && <Loader />}
      </CardBody>
    );
  }

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
          Xóa nhân viên
        </h5>
        <p className="text-center" style={{ fontSize: 16 }}>
          Bạn có muốn xóa nhân viên{" "}
          <b style={{ color: "#272E35" }}>{`"${action?.data?.name}"`}</b>?
        </p>
      </div>

      <div className="modal-footer">
        <Button
          onClick={handleDelete}
          className="ml-2 bilet_button"
          type="button"
        >
          Có
        </Button>
        <Button
          onClick={closeModal}
          className="ml-2 bilet_button outline"
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
