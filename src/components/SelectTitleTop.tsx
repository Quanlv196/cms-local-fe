import React from 'react';
import Select from 'react-select';
import { FormGroup, Input, Label } from 'reactstrap';

/**
 * Renders the PageTitle
 */
interface rootProps{
    title:string,
    required?:boolean,
    value?:any,
    name:string,
    placeholder?:string
    helpBlock?:string,
    options:any,
    disabled?:boolean,
    menuPlacement?:any
    hideLabel?:boolean
    isMulti?:boolean
    errorMessage?:string
    onChange:(e:any)=>void
    onInputChange?:(e:any)=>void
    
}
const SelectTitleTop = (props:rootProps) => {
    const {title, required, value, name, placeholder, helpBlock, options, disabled, menuPlacement, hideLabel, isMulti, errorMessage, onInputChange} = props
    const onChange = (e:any) => {
        props?.onChange(e);
    };
    return (
        <FormGroup>
            {!hideLabel && <Label for={name}>
                {title} {required &&<span className="text-danger ml-1">*</span>}
            </Label>}
            <Select
                isDisabled={disabled || false}
                id={name}
                className="react-select"
                classNamePrefix="react-select"
                placeholder={placeholder || title}
                options={options}
                onChange={(e:any) => onChange(e)}
                onInputChange={(e:any) => onInputChange && onInputChange(e)}
                value={value}
                menuPlacement={menuPlacement}
                isMulti={isMulti}
            ></Select>
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

export default SelectTitleTop;