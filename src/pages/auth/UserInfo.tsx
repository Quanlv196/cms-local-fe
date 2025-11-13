// import { Button, Card, Col, Input, message, Row } from 'antd';
import React, { useState } from "react";

import { useUser } from "../../hooks/useUser";
import PageTitle from "../../components/PageTitle";
import { Button, Modal, Tabs } from "antd";
import InfoComponent from "./components/InfoComponent";
import PageBody from "../../components/PageBody";
import ChangePassword from "./components/ChangePassword";

const UserInfo = () => {
  const user = useUser();
  const [isChangePassword, setIsChangePassword] = useState(false);
  const { TabPane } = Tabs;

  return (
    <>
      <PageTitle
        title="Thông tin tài khoản"
        breadCrumbItems={[{ label: "Thông tin tài khoản", active: true }]}
      />
      <PageBody>
        <Tabs
          className="tab__info"
          defaultActiveKey={"info"}
          tabBarExtraContent={
            <Button
              className="bilet_button primary outline"
              onClick={() => setIsChangePassword(true)}
            >
              Đổi mật khẩu
            </Button>
          }
        >
          <TabPane tab="Thông tin cá nhân" key="info">
            <InfoComponent />
          </TabPane>
        </Tabs>
      </PageBody>
      <Modal
        footer={null}
        onCancel={() => setIsChangePassword(false)}
        visible={isChangePassword}
      >
        <ChangePassword onClose={() => setIsChangePassword(false)} />
      </Modal>
    </>
  );
};

export default UserInfo;

