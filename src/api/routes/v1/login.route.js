const express = require('express');
const controller = require('../../controllers/login.controller');
const router = express.Router();


router.param('qrCode', controller.loadQrCode);

router
  .route('/qr')
  /**
   * @api {get} v1/login/qr Get QR code
   * @apiDescription get random QR code
   * @apiVersion 1.0.0
   * @apiName GetQrCode
   * @apiGroup ChainLogin
   * @apiSuccessExample {json} Success Example:
   * {
   *   "success": true,
   *   "code": 200,
   *   "data": {
   *       "code": "fea99830-49f6-11e8-9edc-1148db96233a",
   *       "content": "qr://sic/login/fea99830-49f6-11e8-9edc-1148db96233a",
   *       "qr": "https://cli.im/api/qrcode/code?text=qr://sic/login/fea99830-49f6-11e8-9edc-1148db96233a&mhid=sELPDFnok80gPHovKdI"
   *   }
   * }
   *
   *
   */
  .get(controller.genQrCode);


router
  .route('/qrCode/:qrCode')
  //@api {post} v1/login/qr/:qrCode query qrCode status
  /**
   * @api {post} v1/login/qrCode/:qrCode Get QR code status
   * @apiDescription get QR code status： 400 timeout，408 unScan，200 scaned
   * @apiVersion 1.0.0
   * @apiName getQrCodeInfo
   * @apiGroup ChainLogin
   *
   * @apiSuccessExample {json} Success Example:
   *{
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "status": 408,
   *        "text": "ddfffffffffffddddddwfdsdddddddddcsdfffffffffffsdfcsdcdcdcdcdcdcdcdcsdc"
   *    }
   *}
   *
   *
   *
   *
   */
  .get(controller.getQrCode)
  /**
   * @api {post} v1/login/qrCode/:qrCode Scan and post data
   * @apiDescription scaned the QR code then post user's data
   * @apiVersion 1.0.0
   * @apiName putQrCodeData
   * @apiGroup ChainLogin
   *
   * @apiParam {String} data     User's data
   *
   * @apiSuccessExample {json} Success Response:
   *{
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "status": 408,
   *        "text": "ddfffffffffffddddddwfdsdddddddddcsdfffffffffffsdfcsdcdcdcdcdcdcdcdcsdc"
   *    }
   *}
   *
   *
   */
  .post(controller.qrCodeLogin);




module.exports = router;
