import { toast } from 'react-toastify';
import { baseUrl } from '../constants/environment';
import APIClient from './APIClient';
import _ from 'lodash';

export const uploadImage = async (image, configs, cancelToken) => {
  const response = await uploadFile(image);
  return response;
};

export const getBase64 = (file) => {
  if (!file) return false
  return new Promise(resolve => {
    let baseURL = "";
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      baseURL = reader.result;
      resolve(baseURL);
    };
    return baseURL
  });
};

export const getBase64All = async (files) => {
  return new Promise(resolve => {
    let baseURL = [];
    Array.from(files)?.map((file, index) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL.push({
          name: file.name,
          baseURL: reader.result,
          file: file
        });
        if (files?.length === index + 1) {
          resolve(baseURL);
        }
      };
    })
    return baseURL
  });
};

export const handleUpload = async (file) => {
  if (!file) return false
  let dtaForm = new FormData();
  let url = ''

  dtaForm.append("file", file);
  const { response, error } = await APIClient.POST('/storage/upload', dtaForm);
  if (error) return null
  return response?.response || ''
}


export const uploadFile = async (file) => {
  if (!file) {
    return null;
  }
  let fileData = null;
  if (file instanceof Blob || file instanceof File) {
    fileData = file;
  } else {
    let { path, mime, name } = file || {};
    mime = mime || 'image/jpeg';
    fileData = {
      uri: path,
      type: mime,
      name:
        name ||
        `${Math.random()
          .toString(36)
          .substring(7)}.${mime.split('/')[1]}`,
    };
  }
  console.log("fileData", fileData)
  const URL = `${baseUrl}/storage/upload`
  const data = new FormData();
  data.append('file', fileData);
  const response = await APIClient.POST(URL, data);
  if (!!!response?.response) {
    toast.error("Không tải được file!")
  }
  return response?.response;

};


export const getVideoCover = (file, seekTo = 0.0) => {
  console.log("getting video cover for file: ", file);
  return new Promise((resolve, reject) => {
    // load the file to a video player
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', URL.createObjectURL(file));
    videoPlayer.load();
    videoPlayer.addEventListener('error', (ex) => {
      reject("error when loading video file", ex);
    });
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        console.log('video is now paused at %ss.', seekTo);
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement("canvas");
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        // return the canvas image as a blob
        ctx.canvas.toBlob(
          async (blob) => {
            const img = await blobToBase64(blob)
            resolve(img);
          },
          "image/jpeg",
          0.75 /* quality */
        );
      });
    });
  });
}


export const blobToBase64 = async (blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}