import React, { useEffect, useRef } from 'react';
import Editor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import APIClient from '../helpers/APIClient';

const MyEditor = (props: any) => {
  const { value, onChange, disabled, height } = props;
  const editor = useRef<any>(null); // Ref cho SunEditor instance
  const valueRef = useRef<string>(value); // Ref lưu giá trị `value`

  const getSunEditorInstance = (sunEditor: any) => {
    editor.current = sunEditor;
  };

  const handleEditorChange = (content: string) => {
    // Đồng bộ giá trị và gọi onChange
    valueRef.current = content;  // Lưu giá trị mới vào valueRef
    onChange?.(content); // Gọi lại onChange từ props để đồng bộ giá trị bên ngoài
  };

  const onImageUploadBefore = () => {
    return (files: any, _info: any, uploadHandler: any) => {
      (async () => {
        const formData = new FormData();
        formData.append('file', files[0]);

        try {
          const response = await APIClient.POST('/storage/upload', formData);
          if (response && response.response) {
            const imageUrl = response.response; // URL trả về từ server
            const responseData = {
              result: [
                {
                  url: imageUrl,
                  name: files[0].name || 'image',
                },
              ],
            };
            uploadHandler(responseData); // Gọi lại uploadHandler với dữ liệu URL
          }
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      })();

      // Dừng upload mặc định để ngăn chặn hình ảnh bị upload hai lần
      uploadHandler();
    };
  };

  // Đồng bộ giá trị `value` vào editor khi giá trị thay đổi từ props
  useEffect(() => {
    if (editor.current && value !== valueRef.current) {
      // Cập nhật nội dung editor khi giá trị `value` thay đổi
      editor.current.setContents(value); // Cập nhật nội dung vào editor

      // Cập nhật lại giá trị ref
      valueRef.current = value;
    }
  }, [value]);

  return (
    <Editor
      defaultValue={value}
      disable={disabled}
      getSunEditorInstance={getSunEditorInstance}
      onImageUploadBefore={onImageUploadBefore()}
      onChange={handleEditorChange} // Cập nhật giá trị khi thay đổi
      setOptions={{
        buttonList: [
          ['undo', 'redo'],
          ['fontSize', 'formatBlock'],
          ['bold', 'italic', 'underline', 'strike'],
          ['align', 'list', 'indent', 'outdent'],
          ['link', 'image', 'table'],
        ],
        // height: '100vh'
      }}
      height={height ? height : '80vh'}
    />
  );
};

export default MyEditor;
