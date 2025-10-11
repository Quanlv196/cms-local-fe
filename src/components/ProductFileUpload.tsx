import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import img_bg_upload from '../assets/images/file-drop-upload.png';
import APIClient from '../helpers/APIClient';
import { getBase64All } from '../helpers/UploadUtils';

/**
 * Renders the PageTitle
 */
interface rootProps{
    handleChangeFile?:any,
    fileTypes?:any,
    imgs?:any,
    disabled?:boolean,
}
const ProductFileUpload = (props:rootProps) => {
    const { fileTypes, imgs, disabled} = props
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
        props?.handleChangeFile(imgs);
    };

    const handleRemove = async (index:number) => {
        const newData = cloneDeep(filesBase64)
        newData.splice(index, 1);
        props?.handleChangeFile(newData);
    };
    const handleDownload = (item:any) => {
        console.log('handleDownload',item)
        APIClient.DOWNLOAD(item?.image_url);
    };
    
    return (
        <>
            <div className="file-drop-img-list">
                <div className="tee-multiple-file-preview">
                    {filesBase64?.map((item:any, index:number)=>{
                        return(
                            <div key={`img-${index}`} className="tee-multiple-file-preview-item" style={{width:'auto'}} onClick={()=>disabled && handleDownload(item)}>
                                <div className="img-item">
                                    {!disabled &&<i className="uil uil-trash-alt" onClick={()=>handleRemove(index)} />}
                                    {/* <img src={item?.url || item?.baseURL} /> */}
                                    <i className="uil uil-file-upload file-upload-icon"></i>
                                    <span className="file-info">{item?.name}</span>
                                </div>
                            </div>
                        )
                    })}
                    <FileUploader
                        multiple={true}
                        handleChange={handleChangeFile}
                        name="file"
                        types={fileTypes}
                        classes="file-drop-img"
                        disabled={disabled}
                    >
                        <div className="tee-multiple-file-preview-item" style={{width:'auto'}}>
                            {disabled ? null :
                            <div className="img-item" style={{border:'none', cursor:'pointer'}}>
                                <img src={img_bg_upload}/>
                            </div>}
                        </div>
                    </FileUploader>
                </div>
            </div>
        </>
    )
}

export default ProductFileUpload;