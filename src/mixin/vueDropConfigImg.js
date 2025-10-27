// vueDropConfig.js
const vueDropConfig  = {
  autoProcessQueue: false,
  acceptedFiles: ".jpg,.jpeg,.png,.bmp",
  url: 'http://localhost:8443/',
  paramName: 'file',
  maxThumbnailFilesize: 1,
  maxFiles: 2,
  maxFilesize: 2, // MB
  duplicateCheck: true,
  thumbnailMethod: "contain",
  addRemoveLinks: true,
  clickable: true,
  uploadMultiple: false,
  dictRemoveFile: '삭제',
  dictCancelUpload: "취소",
  dictDefaultMessage: '전송할 파일을 드래그 하시거나 여기를 클릭하세요<br>이미지(jpg,jpeg,png)만 전송할 수 있습니다',
  init: function () {
    this.on("error", function (file, errorMessage, xhr) {
      //this.removeFile(file);
      if (errorMessage === "You can't upload files of this type.") {
        // alert("업로드가 불가능한 파일 형식입니다.");
      } else if (errorMessage === "You can not upload any more files.") {
        // alert("이미지는 한번에 하나만 보낼 수 있습니다.");
      }
    });
  },
}

export default vueDropConfig;
