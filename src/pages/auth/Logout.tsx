import React, { useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { baseUrl } from "../../constants/environment";
import APIClient from "../../helpers/APIClient";

import { logoutUser } from "../../redux/actions";

const connector = connect(null, { logoutUser });

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  history: any;
};
const Logout: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = async () => {
    const url = `${baseUrl}/api/res_partner/logout`;
    await APIClient.POST(url, {});
    props.logoutUser(props.history);
  };
  return <React.Fragment></React.Fragment>;
};

export default connector(Logout);
