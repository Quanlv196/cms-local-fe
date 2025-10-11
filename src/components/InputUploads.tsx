import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FileUploader } from "react-drag-drop-files";
import { toast } from 'react-toastify';
import img_bg_upload from '../assets/images/file-drop-upload.png';
import APIClient from '../helpers/APIClient';
import { getBase64All } from '../helpers/UploadUtils';

/**
 * Renders the PageTitle
 */
interface rootProps{
    title?:string
    handleChangeFile?:any,
    fileTypes?:any,
    imgs?:any,
    disabled?:boolean,
    max?:number,
}
const InputUploads = (props:rootProps) => {
    const { max, title, fileTypes, imgs, disabled} = props
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
        
        if(disabled){
            return
        }
        const imgBase64:any = await getBase64All(files)
        const imgs = [...filesBase64, ...imgBase64]
        if( max && imgs?.length > max ) {
            toast.warning(`Bạn chỉ được chọn tối đa ${max} tập tin`);
            return false
        }
        props?.handleChangeFile(imgs);
    };

    const handleRemove = async (index:number) => {
        const newData = cloneDeep(filesBase64)
        newData.splice(index, 1);
        props?.handleChangeFile(newData);
    };

    const handleDownload = (item:any) => {
        console.log('handleDownload',item)
        if(item?.image_url){
            window.open(item?.image_url);
        }
        APIClient.DOWNLOAD(item?.image_url);
    };

    return (
        <div className="file-drop">
            <FileUploader
                multiple={true}
                handleChange={handleChangeFile}
                name="file"
                types={fileTypes}
                label={title}
                classes="file-drop-inner"
                disabled={disabled}
            >
                <div>
                    {disabled && filesBase64?.length > 0 ? 
                    <div className='mt-2'>
                        {title}
                    </div>:
                    disabled && filesBase64?.length === 0 ? 
                    <div className='mt-2'>
                        Chưa có file {title} nào
                    </div>:
                    <>
                        <i className="uil uil-export"></i> {title}
                    </>
                    }
                </div>
            </FileUploader>
            <div className="tee-multiple-file-preview">
            {filesBase64?.map((item:any, index:number)=>{
                return(
                    <div key={`upload-${index}`} className="tee-multiple-file-preview-item" style={{width:'auto'}} onClick={()=>disabled && handleDownload(item)}>
                        <div className="img-item">
                            {!disabled &&<i className="uil uil-trash-alt" onClick={()=>handleRemove(index)} />}
                            <i className="uil uil-file-upload file-upload-icon"></i>
                            <span className="file-info">{item?.name}</span>
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}

export default InputUploads;