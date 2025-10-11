import React from 'react';
import { FileUploader } from "react-drag-drop-files";
import APIClient from '../helpers/APIClient';

/**
 * Renders the PageTitle
 */
interface rootProps{
    title:string,
    handleChangeFile?:any,
    fileTypes?:any,
    file?:any,
    multiple?:boolean,
    fileDownload?:any
}
const InputUpload = (props:rootProps) => {
    const {title, fileTypes, file, multiple, fileDownload} = props
    const handleChangeFile = (file:any) => {
        props?.handleChangeFile(file);
    };
    const handleDownload = (item:any) => {
        console.log('handleDownload',item)
        APIClient.DOWNLOAD(item?.download_url);
    };
    return (
        <div className="file-drop">
            <FileUploader
                handleChange={handleChangeFile}
                name="file"
                types={fileTypes}
                label={title}
                classes="file-drop-inner"
            >
                <div>
                    <i className="uil uil-down-arrow"></i> {title}
                        {/* {file?.name ? `(${file?.name})` : ""}  */}
                </div>
                
            </FileUploader>
            {(fileDownload?.name|| file?.name) &&
            <div className="tee-multiple-file-preview-item" style={{width:'auto'}} onClick={()=>fileDownload && handleDownload(fileDownload)}>
                <div className="img-item">
                    <i className="uil uil-file-upload file-upload-icon"></i>
                    <span className="file-info">{file?.name || fileDownload?.name}</span>
                </div>
            </div>}
        </div>
    )
}

export default InputUpload;