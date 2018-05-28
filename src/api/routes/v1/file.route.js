const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/file.controller');
const router = express.Router();
const { authReqBody } = require('../../validations/file.validation');

var multer  = require('multer');
var memoryStorage = multer.memoryStorage();
var upload = multer({ storage : memoryStorage });


router
  .route('/upload')
  /**
   * @api {post} v1/file/upload Upload file
   * @apiDescription upload file
   * @apiVersion 1.0.0
   * @apiName UploadFile
   * @apiGroup File
   * @apiPermission user
   *
   * @apiHeader {String} content-type="multipart/form-data"
   *
   * @apiParam  {String} file file
   *
   * @apiParamExample {json} curl request demo:
   * curl -X POST \
   *   http://localhost:3000/v1/file/upload \
   *   -H 'Cache-Control: no-cache' \
   *   -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
   *   -F 'file=@C:\abc.pdf'
   *
   *
   *

   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "success": true,
   *   "code": 200,
   *   "data":{
   *      "name": "abc.pdf",
   *      "url": "http://www.aaa.com/abc.pdf",
   *      "md5": "TN7tQaztknNUyZZSYU1UDw=="
   *   }
   * }
   *
   *
   */
  .post(upload.single('file'),controller.upload);


router
  .route('/uploads')
  /**
   * @api {post} v1/file/uploads Upload multi files
   * @apiDescription upload multi files
   * @apiVersion 1.0.0
   * @apiName UploadFiles
   * @apiGroup File
   * @apiPermission user
   *
   * @apiHeader {String} content-type="multipart/form-data"
   *
   * @apiParam  {String}             files multi files
   *
   * @apiParamExample {json} curl request:
   * curl -X POST \
   * http://10.3.1.135:3000/v1/file/uploads \
   * -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
   * -F 'files=@C:\Users\admin\Pictures\64.png' \
   * -F 'files=@C:\Users\admin\Pictures\100.png'
   *
   *
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "id": 1524815092209,
   *        "num": 3,
   *        "files": [
   *            {
   *                "name": "64.png",
   *                "md5": "yqstxZHE9OvDkst4FzaVKg==",
   *                "path": "1524815092209/64.png"
   *            },
   *            {
   *                "name": "100.png",
   *                "md5": "aLrSCLUR2F1cth7m+lKv1A==",
   *                "path": "1524815092209/100.png"
   *            },
   *            {
   *                "name": "108.png",
   *                "md5": "N3heWRtjVbZXl0FdZB4A4w==",
   *                "path": "1524815092209/108.png"
   *            }
   *        ]
   *    }
   * }
   *
   *
   */
  .post(upload.array('files',50),controller.uploads);


router
  .route('/auth')
  /**
   * @api {post} v1/file/auth Auth file path
   * @apiDescription get file auth url
   * @apiVersion 1.0.0
   * @apiName getFileAuthUrl
   * @apiGroup File
   *
   * @apiHeader {String} content-type="application/json"
   * @apiParam  {String[]} files files
   * @apiParam  {String} files.path file path
   * @apiParam  {String} [files.name] file name
   * @apiParam  {String} [files.md5] file md5
   *
   *
   * @apiParamExample {json} curl req demo:
   * curl -X POST \
   * http://localhost:3000/v1/file/auth \
   * -H 'Content-Type: application/json' \
   * -d '{"files":[{"name":"64.png","md5":"yqstxZHE9OvDkst4FzaVKg==","path":"1524815092209/64.png"}]}'
   *
   *
   *
   * @apiSuccessExample {json} Success:
   *{
   *    "success": true,
   *    "code": 200,
   *    "data": [
   *        {
   *            "name": "64.png",
   *            "md5": "yqstxZHE9OvDkst4FzaVKg==",
   *            "path": "1524815092209/64.png",
   *            "url": "http://sic-file-dev.oss-cn-beijing.aliyuncs.com/1524815092209/64.png?OSSAccessKeyId=LTAIGl4F7vNnQnpT&Expires=1527047325&Signature=XKYPdkSeDvlvLAyvyw7dCTnsbo4%3D"
   *        }
   *    ]
   *}
   *
   *
   */
  .post(validate(authReqBody),controller.auth);




module.exports = router;
