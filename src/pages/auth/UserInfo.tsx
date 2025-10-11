// import { Button, Card, Col, Input, message, Row } from 'antd';
import React, { useState } from "react";

import { useUser } from "../../hooks/useUser";
import PageTitle from "../../components/PageTitle";
import { Tabs } from "antd";
import InfoComponent from "./components/InfoComponent";
import PageBody from "../../components/PageBody";

const UserInfo = () => {
  const user = useUser();
  const [visible, setVisible] = useState(false);
  const { TabPane } = Tabs;

  return (
    <>
      <PageTitle
        title="Thông tin tài khoản"
        breadCrumbItems={[{ label: "Thông tin tài khoản", active: true }]}
      />
      <PageBody>
        <Tabs className="tab__info" defaultActiveKey={"info"}>
          <TabPane tab="Thông tin cá nhân" key="info">
            <InfoComponent />
          </TabPane>
        </Tabs>
      </PageBody>
    </>
  );
};

export default UserInfo;
