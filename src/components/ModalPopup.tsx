import React from 'react';
import Modal from 'react-modal';
import {customStyles} from '../constants/modal'
Modal.setAppElement('#modal')

const ModalPopup = (props:any)=>{
    const {isOpen, onRequestClose, children} = props
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            {...props}
            >
                {children}
        </Modal>
    )
}
export default ModalPopup;