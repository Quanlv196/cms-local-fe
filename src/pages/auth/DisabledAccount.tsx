import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const DisabledAccount = () => {
  return (
    <Container
      style={{
        backgroundImage: 'url("/icons/bg_line.svg")',
      }}
    >
      <img className="lg" src="/static/media/logo-zappseller.0f3fabdd.png" alt="" />
      <div className="crdct">
        <div className="big_title">Tài khoản ngừng hoạt động</div>
        <img src="/icons/clock.svg" alt="" />
        <div className="des">
          Rất tiếc, Tài khoản của bạn đã chuyển sang trạng thái Ngừng hoạt động.
          Vui lòng liên hệ đến quản lý cơ sở khám/tư vấn hoặc Hotline{" "}
          <b>1900 888 999</b> để được hỗ trợ. Trân thành cảm ơn!
        </div>
        <a  href="/account/logout" >
        <div className="btn">Đóng</div>
                    </a>
        
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .lg{
    width: 200px;
    position: absolute;
    top: 24px;
    left: 100px;
  }
  .crdct {
    width: 600px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-shadow: 0px 15px 30px 0px rgba(11, 81, 142, 0.2);
    padding: 40px;
    .big_title {
      color: var(--black, #1c1d21);
      text-align: center;
      margin-bottom: 20px;
      font-size: 26px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: capitalize;
    }

    .des {
      margin: 20px 0px;
      color: #1c1d21;
      text-align: center;

      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 19.6px; /* 140% */
      b {
        color: var(--blue, #3183ff);

        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 19.6px;
      }
    }
    .btn {
      border-radius: 8px;
      background: var(--blue, #1d2891);
      width: 427px;
      height: 50px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      text-align: center;

      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }
`;
export default DisabledAccount;
