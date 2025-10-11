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
    required?:boolean,
    value?:any,
    type:any,
    name:string,
    placeholder?:string
    helpBlock?:string
    disabled?:boolean
    hideLabel?:boolean
    typeEdit?:string
    iconAppend?:any
    rows?:number
    classNameFormGroup?:string
    enableTime?:boolean
    minDate?:any
    errorMessage?:string
    onChange:(e:any)=>void
    onlyNumber?:boolean
}
const InputTitleTop = (props:rootProps) => {
    const {title, required, type, name, placeholder, helpBlock, disabled, hideLabel, 
        typeEdit, iconAppend, rows, classNameFormGroup, enableTime, minDate, errorMessage, onlyNumber} = props
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [value, setvalue] = useState();
    const elmRef = useRef<any>();
    const editor = useRef<SunEditorCore>();
    const onChange = (e:any) => {
        if(onlyNumber){
            e.target.value = TextUtils.onlyNumber(e.target.value)
        }
        setvalue(e?.target?.value)
        props?.onChange(e);
    };

    useEffect(()=>{
        if(typeEdit === 'sunEditor'){
            const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
            if(props?.value && props?.value === html) return
            const editorStateNew:any = htmlToDraftBlocks(props?.value)
            setEditorState(editorStateNew)
        }else{
            if(props?.value !== value){
                setvalue(props?.value)
            }
        }
    },[props?.value])

    const onChangeEditorState = (value:any) => {
        setEditorState(value)
        const html = draftToHtml(convertToRaw(value.getCurrentContent()))
        onChange({ target: { name: name, value: html } })
    };

    const htmlToDraftBlocks = (html:any) => {
        let editorState:any = EditorState.createEmpty()
        if(html){
            console.log('InputTitleTop', html)
            const blocksFromHtml = htmlToDraft(html);
            if(blocksFromHtml){
                const { contentBlocks, entityMap } = blocksFromHtml;
                const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                editorState = EditorState.createWithContent(contentState);
            }
        }
        return editorState;
    }

    typeEdit === 'flatpickr' && console.log('flatpickrValue', title, value, new Date(moment(value, enableTime ?'YYYY-MM-DD HH:mm:ss':'YYYY-MM-DD').valueOf()), new Date())

    
    return (
        <FormGroup className={classNameFormGroup}>
            {!hideLabel &&<Label for={name}>
                {title} {required &&<span className="text-danger ml-1">*</span>}
            </Label>}
            <InputGroup>
            {typeEdit === 'sunEditor' ?
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={(value:any) => {
                        onChangeEditorState(value)
                    }} 
                    readOnly={disabled || false} 
                />
            :typeEdit === 'flatpickr' ?
                <Flatpickr 
                    value={new Date(moment(value, enableTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD').valueOf())}
                    onChange={(date:any) => { 
                        if(date[0]){
                            const from = moment(date[0]).format(enableTime ?'YYYY-MM-DD HH:mm:ss':'YYYY-MM-DD')
                            if(moment(date[0]).valueOf() !== moment(value, enableTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD').valueOf()){
                                onChange({ target: { name: name, value: from } })
                            }
                        }
                     }} 
                    options={{
                        enableTime: enableTime || false,
                        minDate: minDate ? minDate: undefined,
                        locale: Vietnamese,
                        dateFormat: enableTime ? "d/m/Y H:i" : "d/m/Y",
                        allowInput: true,
                    }}
                    disabled={disabled}
                    className="form-control" 
                    placeholder={placeholder || title} 
                    ref={elmRef}
                />
            :typeEdit === 'numberFormat' ?
                <NumberFormat 
                    onChange={(e:any)=>onChange(e)} id={name}
                    name={name} type={type} className="font-size-12 form-control" 
                    value={value} 
                    placeholder={placeholder || title} thousandSeparator={true} 
                    disabled={disabled || false}
                />
            :
                <Input 
                    disabled={disabled || false} 
                    value={value ? value : ''} 
                    onChange={(e:any) => onChange(e)} 
                    id={name} type={type} name={name} 
                    placeholder={placeholder || title} 
                    rows={rows}
                />
            }
                {iconAppend &&
                <InputGroupAddon addonType="append" onClick={()=>{
                    if(typeEdit === 'flatpickr'){
                        if (!elmRef?.current?.flatpickr) return;
                        setTimeout(() => elmRef.current.flatpickr.open(), 0);
                    }
                }}>
                    <span className="input-group-text">
                        {iconAppend}
                    </span>
                </InputGroupAddon>}
            </InputGroup>
            
            {helpBlock &&
                <span className="help-block">
                    <small>{helpBlock}</small>
                </span>
            }
            {errorMessage &&
                <span className="help-block text-danger display-flex">
                    <small>{errorMessage}</small>
                </span>
            }
        </FormGroup>
    )
}

export default InputTitleTop;