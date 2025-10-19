import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Label,
  FormGroup,
  Button,
  Alert,
  InputGroup,
  InputGroupAddon,
  Input,
} from "reactstrap";
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "../../redux/actions";
import { isUserAuthenticated } from "../../helpers/authUtils";
import Loader from "../../components/Loader";
import { isEmpty } from "lodash";
import APIClient from "../../helpers/APIClient";
import { baseUrl } from "../../constants/environment";
import ParticleBackground from "./components/ParticleBackground";
import UserManager from "../../manager/UserManager";

const titlePage = "Đăng nhập hệ thống";

const Login: React.FC = () => {
  const dispatch = useDispatch();

  const { user, loading, error, sendedOTP, message } = useSelector(
    (state: any) => state.Auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validate, setValidate] = useState(false);
  const [pwdShow, setPwdShow] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isAuthTokenValid = isUserAuthenticated();

  useEffect(() => {
    document.title = titlePage;
    setIsMounted(true);
    document.body.classList.add("authentication-bg");
    return () => {
      setIsMounted(false);
      document.body.classList.remove("authentication-bg");
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(errorMessage)) {
      setErrorMessage("");
      setValidate(true);
    }
    if (handleValidate()) {
      setValidate(true);
    } else {
      setValidate(false);
    }
  }, [username, password]);

  const handleValidSubmit = (event: Event, values: any) => {
    event.preventDefault();
    handleLogin();
  };

  const handleValidate = (showMessage?: boolean) => {
    if (isEmpty(username)) {
      showMessage &&
        setErrorMessage("Vui lòng nhập username đăng nhập của bạn!");
      return false;
    }

    if (isEmpty(password)) {
      showMessage && setErrorMessage("Vui lòng nhập mật khẩu!");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!handleValidate(true)) return;
    setIsLoading(true);

    const formData = { username, password };
    const url = `${baseUrl}/auth/login`;

    let response: any = await APIClient.POST(url, formData);
    setIsLoading(false);

    if (response.error !== undefined) {
      setErrorMessage(response.error.error_description);
    } else if (response.response !== undefined) {
      const result = response?.response;
      const user = result?.user;
      const token = result?.access_token;

      dispatch(loginUser(user, token));
      UserManager._getUserInfo();
    }
  };

  useEffect(() => {
    if (!isAuthTokenValid) {
      dispatch(logoutUser({}));
    }
  }, [isAuthTokenValid, dispatch]);

  if (isAuthTokenValid) {
    return <Redirect to="/" />;
  }

  return (
    <React.Fragment>
      {(isMounted || !isAuthTokenValid) && (
        <div className="account-pages account-pages-bg">
          <ParticleBackground />
          <Container>
            <div className="login__box">
              {/* <div className="logo">
                <img src={logo} alt="logo" />
              </div> */}
              <Card
                className="login__content"
                style={{
                  borderRadius: "1rem",
                  overflow: "hidden",
                  width: 500,
                  maxWidth: "100%",
                  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardBody className="p-5">
                  {isLoading && <Loader />}
                  <div className="mx-auto mb-4">
                    <a className="logo-login" href="/">
                      <h3 className="d-inline align-middle ml-1 font-weight-bold">
                        Đăng nhập
                      </h3>
                    </a>
                  </div>
                  {errorMessage && (
                    <Alert color="danger" isOpen={!!errorMessage}>
                      <div>{errorMessage}</div>
                    </Alert>
                  )}

                  <AvForm onValidSubmit={handleValidSubmit}>
                    <AvGroup>
                      <Label for="username">Tên đăng nhập</Label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <span className="input-group-text">
                            <i className="uil uil-envelope-alt"></i>
                          </span>
                        </InputGroupAddon>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          type="text"
                          autoComplete="off"
                          name="username"
                          id="username"
                          placeholder="Nhập tên đăng nhập"
                        />
                      </InputGroup>
                      <AvFeedback>Trường này là bắt buộc</AvFeedback>
                    </AvGroup>

                    <AvGroup className="mb-3">
                      <Label for="password">Mật khẩu</Label>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <span className="input-group-text">
                            <i className="uil uil-lock"></i>
                          </span>
                        </InputGroupAddon>
                        <AvInput
                          onChange={(e: any) => setPassword(e.target.value)}
                          type={pwdShow ? "text" : "password"}
                          autoComplete="off"
                          name="password"
                          id="password"
                          placeholder="Mật khẩu"
                          value={password}
                        />
                      </InputGroup>
                      <AvFeedback>Trường này là bắt buộc</AvFeedback>
                    </AvGroup>

                    <FormGroup className="form-group mb-0 mt-4 text-center">
                      <Button
                        disabled={!validate}
                        color="primary"
                        className="btn-block"
                      >
                        Đăng nhập
                      </Button>
                    </FormGroup>
                  </AvForm>
                </CardBody>
              </Card>
              {/* <div className="slogan">
                <img src={slogan} alt="logo" />
              </div> */}
            </div>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default Login;
