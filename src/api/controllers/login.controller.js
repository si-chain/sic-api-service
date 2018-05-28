const mcache = require('memory-cache');
const { StringUtils } = require('../utils/CommonsUtils');
const timeout = 400,unblind = 408,blind = 200;

exports.loadQrCode = async (req, res, next, _qrCode) => {
  try {
    let qrCode = null;

    const cachedData = mcache.get(_qrCode);
    if(cachedData){
      qrCode = {};
      qrCode.code = unblind;//数据未绑定
      qrCode.qrCode = _qrCode;
      if(cachedData != _qrCode){
        qrCode.code = blind;//已绑定
        qrCode.data = cachedData;
      }
    }
    req.locals = { qrCode };
    return next();
  } catch (error) {
    next(error);
  }
};

/**
 * 随机生成
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.genQrCode = async (req, res, next) => {

  try{
    let json = {};
    json.success = true;
    json.code = 200;

    let data = {};
    data.code = StringUtils.uuid();//将来可以去掉了
    data.content = "qr://sic/login/"+data.code;
    mcache.put(data.code,data.code,1000*300);

    data.qr = "https://cli.im/api/qrcode/code?text="+data.content+"&mhid=sELPDFnok80gPHovKdI";
    json.data = data;

    res.status(200);
    res.json(json);

  } catch (error) {
    next(error);
  }
};


/**
 * 查询状态
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.getQrCode = async (req, res, next) => {

  try{

    let json = {};
    json.success = true;
    json.code = 200;

    let qrCode = req.locals.qrCode;
    let data = {};
    if(qrCode){
      data.status = qrCode.code;
      if(qrCode.data){//
        data.text = qrCode.data;
      }
    }else{
      data.status = timeout;
    }

    json.data = data;

    res.status(200);
    res.json(json);

  } catch (error) {
    next(error);
  }

};


exports.qrCodeLogin = async (req, res, next) => {

  try{

    let json = {};
    json.success = false;
    let reqData = req.body.data;

    let qrCode = req.locals.qrCode;
    let data = {};
    json.code = qrCode.code;//400超时，408未绑定
    if(qrCode.code == unblind){//
      mcache.put(qrCode.qrCode,reqData,1000*300);
      data.text = qrCode.qrCode;
      json.code = 200;
      json.success = true;
    }
    json.data = data;

    res.status(200);
    res.json(json);

  } catch (error) {
    next(error);
  }

};
