import React, { useEffect, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
// import TableUI from 'quill-table-ui'; // Import TableUI trực tiếp
// import 'quill-table-ui/dist/styles.css'; // Import CSS của TableUI
import { uploadFile } from '../helpers/UploadUtils'; // Hàm upload hình ảnh

// Đăng ký module tableUI với Quill
// Quill.register('modules/tableUI', TableUI);

const TextEditor = (props: any) => {
  const { value, onChange } = props;
  const quillRef = useRef<ReactQuill>(null);

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // Định dạng văn bản
    ['link', 'image', 'formula'], // Thêm liên kết, hình ảnh, công thức
    [{ list: 'ordered' }, { list: 'bullet' }], // Danh sách
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Tiêu đề
    [{ align: [] }], // Căn chỉnh
    ['clean'], // Xóa định dạng
    // ['table'], // Nút thêm bảng
  ];

  const imageHandler = () => {
    const input: any = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        try {
          const imageUrl = await uploadFile(file);
          const quill: any = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, 'image', imageUrl);
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: toolbarOptions,
      handlers: { image: imageHandler },
    },
    // table: true,
    // tableUI: true,
  }), []);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={(data: any) => onChange({ target: { value: data?.target?.value } })}
      modules={modules}
      theme="snow"
      className={`${props?.className ? `${props?.className} react-quill-custom` : 'react-quill-custom'}`}
      {...props}
    />
  );
};

export default TextEditor;
