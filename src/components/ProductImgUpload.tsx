import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { FormGroup, Label } from 'reactstrap';
import img_bg_upload from '../assets/images/img-drop-upload.png';
import { getBase64All } from '../helpers/UploadUtils';

/**
 * Renders the PageTitle
 */
interface rootProps{
    handleChangeFile?:any,
    fileTypes?:any,
    imgs?:any,
    avatar?:any,
    disabled?:boolean,
    errorMessage?:string,
    required?:boolean,
    title?:string
}
const ProductImgUpload = (props:rootProps) => {
    const { fileTypes, imgs, disabled, avatar, errorMessage, required, title} = props
    const [filesBase64, setFilesBase64] = useState<any>(imgs);

    useEffect(() => {
        let timerSetData = setTimeout(
            ()=> {
                setFilesBase64(imgs)
            },
            300
        );
        return () => {
            clearTimeout(timerSetData);
          };
    }, [imgs]);

    const handleChangeFile = async (files:any) => {
        const imgBase64:any = await getBase64All(files)
        const imgs = [...filesBase64, ...imgBase64]
        const avatar = imgs && imgs[0]
        console.log('handleChangeFile', imgs, filesBase64, imgBase64)
        props?.handleChangeFile(imgs, avatar);
    };

    const handleRemove = async (index:number) => {
        const newData = cloneDeep(filesBase64)
        newData.splice(index, 1);
        const avatar = newData && newData[0]
        console.log('handleRemove', newData, avatar)
        props?.handleChangeFile(newData, avatar);
    };

    console.log('ProductImgUpload', avatar)
    return (
        <>
            {title &&
            <FormGroup>
                <Label for={'imgs'}>{title} {required &&<span className="text-danger ml-1">*</span>}</Label>
                {errorMessage &&
                    <span className="help-block text-danger display-flex">
                        <small>{errorMessage}</small>
                    </span>
                }
            </FormGroup>}
            <FileUploader
                multiple={true}
                handleChange={handleChangeFile}
                name="file"
                types={fileTypes}
                disabled={disabled}
                classes="file-drop-img"
            >
                <div className="file-drop-img-inner">
                    <img src={
                        avatar ? avatar : filesBase64 && filesBase64[0]?.image_url ? filesBase64[0]?.image_url
                        : filesBase64[0]?.baseURL ? filesBase64[0]?.baseURL
                        : img_bg_upload
                    } className="img-bg-cursor" />
                    {/* <p className="mt-2">{file?.length > 0 ? `(${file[0]?.name})` : ""}</p> */}
                </div>
            </FileUploader>
            
            <div className="file-drop-img-list">
                <div className="tee-multiple-file-preview">
                    {filesBase64?.map((item:any, index:number)=>{
                        return(
                            <div key={`img-${index}`} className="tee-multiple-file-preview-item">
                                <div className="img-item">
                                    {!disabled && <i className="uil uil-trash-alt" onClick={()=>!disabled && handleRemove(index)} />}
                                    <img src={item?.image_url || item?.baseURL} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default ProductImgUpload;