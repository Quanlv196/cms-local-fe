import {
    AvForm,
    AvGroup,
    AvInput
} from "availity-reactstrap-validation";
import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "react-feather";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import {
    Button, CardBody, Col, FormGroup, Input, InputGroup,
    InputGroupAddon, Label, Row
} from "reactstrap";
import styled from "styled-components";
import Loader from "../../components/Loader";
import ModalPopup from "../../components/ModalPopup";
import PageBody from "../../components/PageBody";
import PageTitle from "../../components/PageTitle";
import { baseUrl } from "../../constants/environment";
import APIClient from "../../helpers/APIClient";
import TextUtils from "../../helpers/TextUtils";

interface Props {
  history: any;
  location: any;
  match: any;
  user: any;
}

const Detail: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [onlyView, setOnlyView] = useState(true);
  const [type, setType] = useState("view");
  const [data, setData] = useState({
    name: "",
    code: "",
    phone: "",
    province_code: "",
    district_code: "",
    ward_code: "",
    street: "",
    note: "",
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState();
  const [usertitle, setUsertitle] = useState<any>([]);
  const [usergroup, setUsergroup] = useState<any>([]);
  const [roles, setRoles] = useState<any>([]);

  useEffect(() => {
    loadData();
    document.title = "Thông tin cá nhân";
    setOnlyView(true);
  }, []);

  useEffect(() => {
    loadInit();
  }, []);

  const handleActionModal = (item: any) => {
    setAction(item);
    setIsOpen(true);
  };

  const loadInit = async () => {
    const params = {
      status: 1,
      page: 1,
      limit: 100,
    };
    const [responseUserTitle, responseUserGroup, responseRoles] =
      await Promise.all([
        APIClient.GET(`${baseUrl}/usertitle`, params),
        APIClient.GET(`${baseUrl}/usergroup`, params),
        APIClient.GET(`${baseUrl}/roles`, params),
      ]);
    if (responseUserTitle.response?.data !== undefined) {
      let ListArr: any = [];
      responseUserTitle.response?.data?.map((e: any) => {
        ListArr?.push({
          ...e,
          value: e?.id,
          label: e?.name,
        });
      });
      setUsertitle(ListArr);
    }
    if (responseUserGroup.response?.data !== undefined) {
      let ListArr: any = [];
      responseUserGroup.response?.data?.map((e: any) => {
        ListArr?.push({
          ...e,
          value: e?.id,
          label: e?.name,
        });
      });
      setUsergroup(ListArr);
    }
    if (responseRoles.response?.data !== undefined) {
      let ListArr: any = [];
      responseRoles.response?.data?.map((e: any) => {
        ListArr?.push({
          ...e,
          value: e?.id,
          label: e?.name,
        });
      });
      setRoles(ListArr);
    }
  };

  const loadData = async () => {
    const url = `${baseUrl}/auth/me`;
    setLoading(true);
    let response: any = await APIClient.GET(url);
    setLoading(false);
    if (response.error !== undefined) {
      toast.error(response.error.error_description);
    } else if (response.response !== undefined) {
      const resData = response.response;
      setData({
        ...resData,
        usertitle_id: resData?.usertitle_id?.id,
        usergroup_id: resData?.usergroup_id?.id,
        roles: resData?.roles?.reduce((prev: any, item: any) => {
          prev = [...prev, item?.id];
          return prev;
        }, []),
      });
    }
  };

  return (
    <React.Fragment>
      <PageTitle
        breadCrumbItems={[{ label: "Thông tin cá nhân", active: true }]}
        title={`Thông tin cá nhân`}
      />
      <PageBody>
        <ContentPage
          data={data}
          setData={(val: any) => setData(val)}
          usertitle={usertitle}
          usergroup={usergroup}
          roles={roles}
          onlyView={onlyView}
          type={type}
          action={action}
          handleActionModal={(data: any) => handleActionModal(data)}
        />
      </PageBody>
      <ModalPopup isOpen={modalIsOpen} onRequestClose={() => setIsOpen(false)}>
        <RenderActionModal
          {...props}
          closeModal={() => setIsOpen(false)}
          action={action}
          loadData={() => loadData()}
        />
      </ModalPopup>
      {loading && <Loader />}
    </React.Fragment>
  );
};

const ContentPage = (props: any) => {
  const { data, type, setData, usertitle, usergroup, roles, onlyView, id } =
    props;
  const [loading, setLoading] = useState(false);
  const router = useHistory();

  const handleChangeInput = (event?: any) => {
    let { value, name } = event.target;
    if (value === " ") return;
    if (name === "phone") {
      value = value.replace(/[a-zA-Z!@#$%^&*();.',/\|{}ơ]/g, "");
    }
    setData({
      ...data,
      [name]: value,
    });
  };

  const validationFrom = () => {
    if (isEmpty(data.name)) {
      toast.warning("Tên người dùng không được để trống!");
      return false;
    }
    if (isEmpty(data.phone)) {
      toast.warning("Số điện thoại không được để trống!");
      return false;
    }
    if (data.phone?.length > 11) {
      toast.warning("Số điện thoại không vượt quá 11 số!");
      return false;
    }
    if (!TextUtils.validatePhone(data.phone)) {
      toast.warning("Số điện thoại không đúng!");
      return false;
    }
    if (isEmpty(data.email)) {
      toast.warning("Email không được để trống!");
      return false;
    }
    if (!TextUtils.validateEmail(data.email)) {
      toast.warning("Email không đúng!");
      return false;
    }
    // if(!id && isEmpty(data.password)){
    //     toast.warning('Mật khẩu không được để trống!');
    //     return false
    // }
    // if (!(data.usertitle_id)) {
    //     toast.warning('Chức danh không được để trống!');
    //     return false
    // }
    // if (!(data.usergroup_id)) {
    //     toast.warning('Nhóm người dùng không được để trống!');
    //     return false
    // }

    return true;
  };

  const handleFilterMulti = (name: string, option: any, onChange: any) => {
    const value: any = [];
    option &&
      option.map((item: any) => {
        value.push(item.value);
      });
    onChange({ target: { name, value } });
  };
  const getFilterMulti = (list: any, value: any) => {
    if (value instanceof Array) {
      const option: any = [];
      list &&
        list.map((item: any) => {
          const found =
            value.length > 0 &&
            value.find((element: any) => element == item.value);
          if (found || found === 0) {
            option.push(item);
          }
        });
      return option;
    }
    return [];
  };

  return (
    <PageContent className={onlyView ? "only-view" : ""}>
      <div className="nutri-title mb-3">Thông tin người dùng</div>
      <Row>
        <Col md={3} xs={12}>
          <FormGroup className="nutri-form">
            <Label>
              <span>*</span>Tên người dùng
            </Label>
            <Input
              type="text"
              value={data?.name}
              onChange={(e: any) => handleChangeInput(e)}
              name="name"
              placeholder="Nhập tên người dùng"
            />
          </FormGroup>
        </Col>
        <Col md={3} xs={12}>
          <FormGroup className="nutri-form">
            <Label>
              <span>*</span>Số điện thoại
            </Label>
            <InputGroup>
              <Input
                type="text"
                value={data?.phone}
                onChange={(e: any) => handleChangeInput(e)}
                name="phone"
                placeholder="Nhập số điện thoại"
              />
              {/* {!id && <InputGroupAddon addonType="append">
                                <img src={PhoneImageIcon} width={18} height={18} alt="" style={{marginTop: 10}}/>
                            </InputGroupAddon>} */}
            </InputGroup>
          </FormGroup>
        </Col>
        <Col md={3} xs={12}>
          <FormGroup className="nutri-form">
            <Label>
              <span>*</span>Email
            </Label>
            <Input
              type="text"
              value={data?.email}
              onChange={(e: any) => handleChangeInput(e)}
              name="email"
              placeholder="Nhập email"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md={3} xs={12}>
          <FormGroup className="nutri-form">
            <Label>Chức danh</Label>
            <Select
              placeholder={
                type === "view" && !data?.usertitle_id
                  ? "---"
                  : "Chọn Chức danh"
              }
              className="react-select mb-2"
              classNamePrefix="react-select"
              isDisabled={onlyView}
              onChange={(val: any) => {
                setData({ ...data, usertitle_id: val?.value });
              }}
              value={usertitle?.filter(
                (option: any) => data?.usertitle_id == option.value
              )}
              options={usertitle}
            ></Select>
          </FormGroup>
        </Col>
        <Col md={3} xs={12}>
          <FormGroup className="nutri-form">
            <Label>Nhóm người dùng</Label>
            <Select
              placeholder={
                type === "view" && !data?.usergroup_id
                  ? "---"
                  : "Chọn nhóm người dùng"
              }
              className="react-select mb-2"
              classNamePrefix="react-select"
              isDisabled={onlyView}
              onChange={(val: any) => {
                setData({ ...data, usergroup_id: val?.value });
              }}
              value={usergroup?.filter(
                (option: any) => data?.usergroup_id == option.value
              )}
              options={usergroup}
            ></Select>
          </FormGroup>
        </Col>
        <Col md={3} xs={12}>
          <FormGroup className="nutri-form">
            <Label>Nhóm quyền</Label>
            <Select
              placeholder={
                type === "view" && data?.roles?.length === 0
                  ? "---"
                  : "Chọn nhóm quyền"
              }
              className="react-select mb-2"
              classNamePrefix="react-select"
              isDisabled={onlyView}
              isMulti
              onChange={(val: any) => {
                handleFilterMulti("roles", val, handleChangeInput);
              }}
              value={getFilterMulti(roles, data?.roles || [])}
              options={roles}
            ></Select>
          </FormGroup>
        </Col>
        <Col md={3} xs={12}>
          <FormGroup className="nutri-form">
            <Label>Ghi chú</Label>
            <Input
              type="text"
              value={type === "view" && !data?.note ? "---" : data?.note}
              onChange={(e: any) => handleChangeInput(e)}
              name="note"
              placeholder="Nhập ghi chú"
            />
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Button
          onClick={() => {
            props.handleActionModal(data);
          }}
          className="ml-2 pl-3 pr-3"
          color="success"
          type="button"
        >
          {" "}
          Đổi mật khẩu{" "}
        </Button>
      </Row>
      {loading && <Loader />}
    </PageContent>
  );
};

const RenderActionModal = (props: any) => {
  const [loading, setLoading] = useState(false);
  const { closeModal, action, loadData } = props;
  const [pwdShow, setPwdShow] = useState(false);
  const [pwdNewShow, setPwdNewShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [valLength, setValLength] = useState<any>(false);
  const [valText, setValText] = useState<any>(false);
  const [data, setData] = useState({
    pwd: "",
    newPwd: "",
  });

  useEffect(() => {
    validateRegex();
    validateLength();
  }, [data?.newPwd]);

  const validateLength = () => {
    if (data?.newPwd?.length > 5) {
      setValLength(true);
    } else {
      setValLength(false);
    }
  };

  const validateRegex = () => {
    if (TextUtils.checkNumberAndText(data?.newPwd)) {
      setValText(true);
    } else {
      setValText(false);
    }
  };

  const handleValidate = (showMessage?: boolean) => {
    if (isEmpty(data?.pwd)) {
      showMessage && setErrorMessage("Vui lòng nhập mật khẩu cũ!");
      return false;
    }

    if (isEmpty(data?.newPwd)) {
      showMessage && setErrorMessage("Vui lòng nhập mật khẩu mới!");
      return false;
    }
    return true;
  };
  const handleChangePass = async () => {
    if (!handleValidate(true)) return;
    setLoading(true);
    const formData = {
      password: data?.pwd,
      newpassword: data?.newPwd,
    };
    const url = `${baseUrl}/auth/me/changepass`;
    let response: any = await APIClient.PUT(url, formData);
    setLoading(false);
    if (response.error !== undefined) {
      setErrorMessage(response.error.error_description);
    } else if (response.response !== undefined) {
      props?.loadData();
    }
  };

  return (
    <CardBody className="p-0 account-pages" style={{ width: 560 }}>
      <div className="modal-header">
        <h5 className="modal-title" id="modal-action-title">
          Đổi mật khẩu
        </h5>
        <button onClick={() => closeModal()} type="button" className="close">
          {" "}
          <span aria-hidden="true">×</span>{" "}
        </button>
      </div>
      <div className="modal-body pt-2 pb-2 p-4">
        <Col md={12}>
          <Row>
            <Col md={6} className="pl-3 pr-3 position-relative">
              <AvForm className="authentication-form">
                <AvGroup className="">
                  <Label style={{ color: "#8181A5", fontSize: 14 }}>
                    Mật khẩu hiện tại
                  </Label>
                  <InputGroup>
                    <InputGroupAddon
                      addonType="prepend"
                      style={{ cursor: "pointer" }}
                    >
                      <InputGroupAddon
                        addonType="append"
                        onClick={() => {
                          setPwdShow(!pwdShow);
                        }}
                      >
                        <span className="input-group-text">
                          {pwdShow ? <EyeOff /> : <Eye />}
                        </span>
                      </InputGroupAddon>
                    </InputGroupAddon>
                    <AvInput
                      onChange={(e: any) =>
                        setData({ ...data, pwd: e.target.value })
                      }
                      type={pwdShow ? "text" : "password"}
                      name="email"
                      placeholder="Mật khẩu hiện tại"
                    />
                  </InputGroup>
                </AvGroup>
              </AvForm>
            </Col>
            <Col md={6} className="pl-3 pr-3 position-relative">
              <AvForm className="authentication-form">
                <AvGroup className="">
                  <Label style={{ color: "#8181A5", fontSize: 14 }}>
                    Mật khẩu mới
                  </Label>
                  <InputGroup>
                    <InputGroupAddon
                      addonType="prepend"
                      style={{ cursor: "pointer" }}
                    >
                      <InputGroupAddon
                        addonType="append"
                        onClick={() => {
                          setPwdNewShow(!pwdNewShow);
                        }}
                      >
                        <span className="input-group-text">
                          {pwdNewShow ? <EyeOff /> : <Eye />}
                        </span>
                      </InputGroupAddon>
                    </InputGroupAddon>
                    <AvInput
                      onChange={(e: any) =>
                        setData({ ...data, newPwd: e.target.value })
                      }
                      type={pwdNewShow ? "text" : "password"}
                      name="email"
                      placeholder="Mật khẩu mới"
                    />
                  </InputGroup>
                </AvGroup>
              </AvForm>
            </Col>
          </Row>
          <Row>
            <Col className="pl-3 pb-3 position-relative" md={12}>
              <div className="validate-list">
                <div className={valLength ? "item active" : "item"}>
                  Tối thiểu 6 ký tự
                </div>
                <div className={valText ? "item active" : "item"}>
                  Bao gồm số và chữ số
                </div>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6} xs={12}>
              <FormGroup className="form-group mb-0 text-center">
                <Button
                  style={
                    valLength && valText
                      ? {}
                      : { opacity: 0.4, cursor: "unset" }
                  }
                  className="btn-block"
                  onClick={valLength && valText && handleChangePass}
                >
                  Lưu
                </Button>
              </FormGroup>
            </Col>
          </Row>
        </Col>
      </div>
      {loading && <Loader />}
    </CardBody>
  );
};

const ValueText = styled.div`
  min-height: 36px;
  display: flex;
  align-items: center;
`;

const mapState = (state: any) => {
  return {
    user: state.Auth.user,
  };
};

const PageContent = styled.div`
  &.only-view {
    .nutri-form {
      input {
        border: none;
        pointer-events: none;
      }
      .react-select__indicators {
        display: none !important;
      }
      .react-select__control {
        border: none;
        background-color: transparent !important;
      }
    }
  }
`;

export default connect(mapState)(Detail);
