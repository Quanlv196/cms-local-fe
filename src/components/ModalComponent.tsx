import { Modal, ModalProps } from "antd";
import React, { useState, useEffect, CSSProperties } from "react";
import styled from "styled-components";

interface IModal extends ModalProps {
    children?: any;
    footer?: any;
    description?: string;
    width?: any
}

const markStyleConfig = {
    background: `rgba(26, 32, 44, 0.3)`,
    backdropFilter: `blur(2px)`,
};
const ModalComponent = (props: IModal) => {
    const { visible, children, title, description, footer, maskClosable, width } = props;
    return (
        <Container>
            {visible && (
                <Modal
                    maskStyle={markStyleConfig}
                    className="__my_modal_customer"
                    {...props}
                    closable={false}
                    footer={false}
                    title={false}
                    width={width || '520px'}
                    maskClosable={maskClosable}
                >
                    {title && (
                        <div className="header_content">
                            <div className="my_title">{title}</div>
                            {description && <div className="my_des">{description}</div>}
                        </div>
                    )}
                    {children}

                    {
                        footer && (
                            <div className="my_footer">
                                {footer}
                            </div>
                        )
                    }
                </Modal>
            )}
        </Container>
    );
};

const Container = styled.div`
    .ant-modal-content {
        border-radius: 16px;
        filter: drop-shadow(0px 16px 48px rgba(0, 0, 0, 0.22));
        overflow: hidden;
        box-shadow: unset !important;
    }

    
`;
export default ModalComponent;
