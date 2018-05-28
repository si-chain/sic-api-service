const httpStatus = require('http-status');
const co = require('co');
var multer  = require('multer');
var upload = multer({ dest: './tmp/' });
const { sic } = require('../../config/constant');
const { StringUtils } = require('../utils/CommonsUtils');

const { aliOssClient } = require('../../config/alioss');
const { handler: errorHandler } = require('../middlewares/error');


/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.upload = async (req, res, next) => {
  try{
    var file = req.file;
    /*console.info(file);
    console.info(file.originalname);
    console.info(file.mimetype);
    console.info(file.buffer);*/
    var fileName = file.originalname;

    co(function* () {
      let newFileName = StringUtils.uuid();
      let pointIndex = fileName.lastIndexOf('.');
      if(pointIndex > 0){
        newFileName = newFileName+fileName.substring(pointIndex,fileName.length);
      }

      let ossPath = now + '/' +newFileName;
      let data = yield aliOssClient.put(ossPath,file.buffer);



      data["md5"] = data.res.headers["content-md5"];
      delete data.res;

      console.log(data);
      let json = {};
      json.success = true;
      json.code = 200;
      json.data = data;

      res.status(200);
      res.json(json);
    });
  } catch (error) {
    next(error);
  }

};


exports.uploads = async (req, res, next) => {
  try{
    var files = req.files;
    let now = Date.now();

    let fArry = [];

    co(function* () {
      for(let i=0;i<files.length;i++){
        let file = files[i];
        let fileName = file.originalname;
        // rename file
        let newFileName = StringUtils.uuid();
        let pointIndex = fileName.lastIndexOf('.');
        if(pointIndex > 0){
          newFileName = newFileName+fileName.substring(pointIndex,fileName.length);
        }

        let ossPath = now + '/' +newFileName;
        let ossFile = yield aliOssClient.put(ossPath,file.buffer);

        ossFile["md5"] = ossFile.res.headers["content-md5"];
        ossFile.name = newFileName;
        ossFile.path = ossPath;

        delete ossFile.res;
        delete ossFile.url;

        console.log(ossFile);
        fArry.push(ossFile)
      }

      let json = {};
      json.success = true;
      json.code = 200;
      yield json.data = {
        id:now,
        num:fArry.length,
        files:fArry
      };

      res.status(200);
      res.json(json);
    });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.auth = async (req, res, next) => {
  try{

    let files = req.body.files;

    if(files && files.length > 0){
      files.forEach(item => {
        try{
          item.url = aliOssClient.signatureUrl(item.path,{expires: sic.file.auth.expires});//auth an hour
        }catch (err){
          console.error(err);
        }
      });
    }

    let json = {};
    json.success = true;
    json.code = 200;
    json.data = files;

    res.status(200);
    res.json(json);
  } catch (error) {
    next(error);
  }

};
