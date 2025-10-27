// vueDropConfig.js
const vueDropConfig  = {
  autoProcessQueue: false,
  acceptedFiles: ".jpg, .jpeg, .gif, .bmp, .png, .tiff, .bmp"
    + ', .mp4, .m4v, .avi, .asf, .wmv, .mkv, .ts, .mpg, .mpeg, .mov, .flv, .ogv'
    + ', .mp3, .wav, .flac, .tta, .tak, .aac, .wma, .ogg, .m4a'
    + ', .pdf, .odp, .ppt, .pptx, .key, .show, .doc, .docx, .hwp, .txt, .rtf, .xml, .wks, .wps'
    + ', .xps, .md, .odf, .odt, .pages, .ods, .csv, .tsv, .xls, .xlsx, .numbers, .cell, .psd'
    + ', .ai, .sketch, .tif, .tiff, .tga, .webp, .zip, .gz, .bz2, .rar, .7z, .lzh, .alz',
  url: 'http://localhost:8443/',
  paramName: 'file',
  maxThumbnailFilesize: 1,
  maxFiles: 2,
  maxFilesize: 300, // MB
  duplicateCheck: true,
  thumbnailMethod: "contain",
  addRemoveLinks: true,
  clickable: true,
  uploadMultiple: false,
  dictRemoveFile: '삭제',
  dictCancelUpload: "취소",
  dictDefaultMessage: '전송할 파일을 드래그 하시거나 여기를 클릭하세요<br>전송가능파일'
    + '<br>이미지 : jpg, jpeg, gif, bmp, png, tiff, bmp'
    + '<br>동영상 : mp4, m4v, avi, asf, wmv, mkv, ts, mpg, mpeg, mov, flv, ogv'
    + '<br>오디오 : mp3, wav, flac, tta, tak, aac, wma, ogg, m4a'
    + '<br>파일 : pdf, odp, ppt, pptx, key, show, doc, docx, hwp, txt, rtf, xml, wks, wps'
    + '<br>, xps, md, odf, odt, pages, ods, csv, tsv, xls, xlsx, numbers, cell, psd'
    + '<br>, ai, sketch, tif, tiff, tga, webp, zip, gz, bz2, rar, 7z, lzh, alz',
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
