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
interface rootProps {
    required?: boolean,
    value?: any,
    type: any,
    name: string,
    placeholder?: string
    helpBlock?: string
    disabled?: boolean
    hideLabel?: boolean
    typeEdit?: string
    iconAppend?: any
    rows?: number
    classNameFormGroup?: string
    enableTime?: boolean
    minDate?: any
    errorMessage?: string
    onChange: (e: any) => void
    onlyNumber?: boolean
}
const InputTitleTop = (props: rootProps) => {
    const { name, disabled, onlyNumber } = props
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [value, setvalue] = useState();
    const editor = useRef<SunEditorCore>();
    const onChange = (e: any) => {
        if (onlyNumber) {
            e.target.value = TextUtils.onlyNumber(e.target.value)
        }
        setvalue(e?.target?.value)
        props?.onChange(e);
    };

    useEffect(() => {
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        if (props?.value && props?.value === html) return
        const editorStateNew: any = htmlToDraftBlocks(props?.value)
        setEditorState(editorStateNew)
    }, [props?.value])

    const onChangeEditorState = (value: any) => {
        setEditorState(value)
        const html = draftToHtml(convertToRaw(value.getCurrentContent()))
        onChange({ target: { name: name, value: html } })
    };

    const htmlToDraftBlocks = (html: any) => {
        let editorState: any = EditorState.createEmpty()
        if (html) {
            console.log('InputTitleTop', html)
            const blocksFromHtml = htmlToDraft(html);
            if (blocksFromHtml) {
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                editorState = EditorState.createWithContent(contentState);
            }
        }
        return editorState;
    }

    return (
        <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={(value: any) => {
                onChangeEditorState(value)
            }}
            readOnly={disabled || false}
            wrapperStyle={{ opacity: disabled ? '.5' : 1 }}
        />
    )
}

export default InputTitleTop;