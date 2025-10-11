import React, { useEffect, useRef, useState } from 'react';
import { FormGroup, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap';
import SunEditorCore from "suneditor/src/lib/core";
import SunEditor from 'suneditor-react';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
// import 'suneditor/dist/css/suneditor.min.css';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import Flatpickr from 'react-flatpickr'
import { Vietnamese } from 'flatpickr/dist/l10n/vn'
import moment from 'moment';
import { Phone } from 'react-feather';
import TextUtils from '../helpers/TextUtils';
import NumberFormat from 'react-number-format';

/**
 * Renders the PageTitle
 */
interface rootProps{
    title:string,
    value?:any,
    type?:any
}
const LabelValue = (props:rootProps) => {
    const {title, value, type} = props
    return (
        <>
        <div className="row label-value">
            <Label className="col-lg-4 col-form-label">
                {title}
            </Label>
            <Label className="col-lg-8 col-form-label">
                {type === 'price_format' ?
                <NumberFormat 
                    thousandSeparator=","
                    value={value}
                    displayType="text"
                    renderText={(value:any) => (
                        <span>{value} đ</span>
                    )}
                />:type === 'number_format' ?
                <NumberFormat 
                    thousandSeparator=","
                    value={value}
                    displayType="text"
                />: value}
            </Label>
        </div>
        
        </>
    )
}

export default LabelValue;