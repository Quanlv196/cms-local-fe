import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { FormGroup, Input, Label } from 'reactstrap';
import TextUtils from '../helpers/TextUtils';

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
    onChange:(e:any)=>void
    onlyNumber?:boolean
    errorMessage?:string
}
const InputNumberTitleTop = (props:rootProps) => {
    const {title, required, type, name, placeholder, helpBlock, disabled, onlyNumber, errorMessage} = props
    const [value, setvalue] = useState();
    const onChange = (e:any) => {
        if(onlyNumber){
            setvalue(TextUtils.onlyNumber(e.target.value))
            e.target.value = TextUtils.onlyNumber(e.target.value)
        }else{
            setvalue(e?.target?.value)
        }
        props?.onChange(e);
    };

    useEffect(()=>{
        if(props?.value !== value){
            setvalue(props?.value)
        }
    },[props?.value])

    return (
        <FormGroup>
            <Label for={name}>
                {title} {required &&<span className="text-danger ml-1">*</span>}
            </Label>
            {/* <Input value={value} onChange={(e:any) => onChange(e)} id={name} type={type} name={name} placeholder={placeholder || title} /> */}
            <NumberFormat 
                onChange={(e:any)=>onChange(e)} id={name}
                name={name} type={type} className="font-size-12 form-control" 
                value={value} 
                placeholder={placeholder || title} thousandSeparator={true} 
                disabled={disabled || false}
            />
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

export default InputNumberTitleTop;