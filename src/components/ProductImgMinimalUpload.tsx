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
const ProductImgMinimalUpload = (props:rootProps) => {
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

    const handleUpload = async (name:any, base64:any) => {
        if(!base64) return false
        const url = `/api/ir_attachment/upload`;
        const datas = base64?.split(',')
        const formData = {
            "params": {
                "filename": name, //tên file
                "model": "res.partner", //res.partner là upload file cho seller, buyer
                "datas": datas && datas[1]
            }
        }
        
        let response: any = await APIClient.POST(url, formData);
        let id:any = 0;
        if (response.response !== undefined) {
            const result = response.response?.result
            id = result?.item?.id;
        }
        return id
    }
    const handleUploadImage = async (imgs:any) => {
        if(imgs?.length === 0) return []
        return new Promise(resolve => {
            let image_ids:any = [];
            imgs?.map(async(file:any, index:number)=>{
                const id = await handleUpload(file?.name, file?.baseURL);
                if(id) image_ids.push({
                    ...file,
                    id: id
                });
                if(imgs?.length === index + 1){
                    resolve(image_ids);
                }
            })
            return image_ids
        });
    }

    const handleChangeFile = async (files:any) => {
        console.log('ProductImgMinimalUpload', files)
        const imgBase64:any = await getBase64All(files)
        const image_ids:any = await handleUploadImage(imgBase64);
        const imgs = [...filesBase64, ...image_ids]
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
                                <div className="img-item minimal">
                                    {!disabled &&<i className="uil uil-trash-alt" onClick={()=>handleRemove(index)} />}
                                    <img src={item?.url || item?.baseURL} />
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
                            <div className="img-item minimal" style={{border:'none', cursor:'pointer'}}>
                                <img src={img_bg_upload}/>
                            </div>}
                        </div>
                    </FileUploader>
                </div>
            </div>
        </>
    )
}

export default ProductImgMinimalUpload;