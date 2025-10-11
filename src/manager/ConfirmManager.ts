import { Modal, ModalFuncProps } from "antd";
import { omit } from "lodash";

class ConfirmManager {
   
    show = (props: ModalFuncProps) => {
      let newProps = omit(props, 'type')
      Modal.confirm({
        ...newProps,
        className: `_my_custorm_confirm ${props?.className ?? ''}`,
        maskStyle:{
          background: `rgba(26, 32, 44, 0.3)`,
          backdropFilter: `blur(2px)`,
        }
      })
    }
    error = (props: ModalFuncProps) => {
      let newProps = omit(props, 'type')
      Modal.error({
        ...newProps,
        className: '_my_custorm_confirm',
        maskStyle:{
          background: `rgba(26, 32, 44, 0.3)`,
          backdropFilter: `blur(2px)`,
        }
      })
    }
    delete = (props: ModalFuncProps) => {
      let newProps = omit(props, 'type')
      Modal.confirm({
        ...newProps,
        okType: 'danger',
        className: `_my_custorm_confirm ${props?.className ?? ''}`,
        maskStyle:{
          background: `rgba(26, 32, 44, 0.3)`,
          backdropFilter: `blur(2px)`,
        }
      })
    }
  }
  
  export default new ConfirmManager();
  