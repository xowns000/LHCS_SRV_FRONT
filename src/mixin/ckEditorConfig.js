// editorConfig.js
const editorConfig = {
  height: '150px',
  toolbar: [
    ["Undo", "Redo"],
    { name: 'basicstyles', items: ['Font','FontSize', 'Bold', 'Italic', 'Underline', 'Strike'] },
    { name: 'colors', items: ['TextColor', 'BGColor'] },
    { name: 'insert', items: ['Table', 'Image']},
  ],
  font_defaultLabel: '맑은 고딕',
  fontSize_defaultLabel: '13px',
  font_names : '맑은 고딕; 돋움; 굴림; 궁서; 바탕',
  resize_enabled : false,
  removePlugins: 'image',
  allowedContent: true,
  extraPlugins: ['font','colorbutton','colordialog','tableresize', 'dragresize','simpleImageUpload'],

  filebrowserImageUploadUrl: '/api/editor/imageUpload.do?command=QuickUpload&type=Images',
  simpleuploads_acceptedExtensions : '7z|avi|csv|doc|docx|flv|gif|gz|gzip|jpeg|jpg|mov|mp3|mp4|mpc|mpeg|mpg|ods|odt|pdf|png|ppt|pxd|rar|rtf|tar|tgz|txt|vsd|wav|wma|wmv|xls|xml|zip',
  versionCheck: false,
};

export default editorConfig;
