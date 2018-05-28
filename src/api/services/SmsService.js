const SMSClient = require('@alicloud/sms-sdk');
const { aliyun,sicAccount,env } = require('../../config/vars');
const { sic } = require('../../config/constant');
const { memCacheService } = require('./CacheService');
const { RandomStringUtils } = require('../utils/CommonsUtils');
const eosService = require('../services/eos.service');

const accessKeyId = aliyun.sms.accessKeyId;
const secretAccessKey = aliyun.sms.accessKeySecret;

//sms_client
const smsClient = new SMSClient({accessKeyId, secretAccessKey});

async function sendVerifyMobileCode(mobile,country = 86,tplCode = sic.sms.code.tplCode){

  let result = {
    success:false,
    message:''
  };


  let templateCode = 'SMS_'+tplCode;//短信模板
  let cacheKey = tplCode+country+mobile;
  /*
  { Message: 'OK',
    RequestId: '82884437-E764-4D6E-9489-77DE9CB97B9A',
    BizId: '796502926905494760^0',
    Code: 'OK' }
  */
  try {
    let oldValue = memCacheService.get(cacheKey);
    if(oldValue){
      memCacheService.remove(cacheKey);
    }
    //console.info(g);

    let code = RandomStringUtils.randomInt(4);//生成随机码4位，写入缓存,5分钟有效
    console.info(mobile+'--->'+code);
    if(country != 86){
      mobile = '00'+country+mobile;//接收号码格式为00+国际区号+号码
    }

    let smsResponse = await smsClient.sendSMS({
      PhoneNumbers: mobile,
      SignName: sic.sms.sign,
      TemplateCode: templateCode,
      TemplateParam: '{"code":"'+code+'"}',
      OutId:mobile+''+Date.now()
    });
    let {Code} = smsResponse;
    if (Code === 'OK') {
      let res = memCacheService.put(cacheKey,code,sic.sms.code.seconds);
      if(res === code){
        result.success = true;
      }else{
        console.error('cache error!');
        result.message = 'cache error!';
      }
    }else{
      console.error(smsResponse);
      result.message = 'sms api error!';
    }
    return result;
  } catch (err){
    console.error(err);
    if(err.data){
      //{"Message":"触发天级流控Permits:10","RequestId":"FE117689-E554-40BD-89F8-5ACCE5F49830","Code":"isv.BUSINESS_LIMIT_CONTROL"}
      //{ Message: '触发分钟级流控Permits:1',RequestId: '1F3D0AD8-2ACD-46B8-AF0E-F88A471E8462',Code: 'isv.BUSINESS_LIMIT_CONTROL' }
      /*console.error('--->'+err.data.Code);
      console.error('--->'+err.data.Message);*/
      let code = err.data.Code;
      if('isv.MOBILE_NUMBER_ILLEGAL' === code){
        result.code = sic.api.error.sms.phone_number_err;
        result.message = 'invalid mobile number';
      }else if('isv.BUSINESS_LIMIT_CONTROL' === code){
        result.code = sic.api.error.sms.sms_permit;
        result.message = 'get sms code too frequently!';
      }else{
        result.code = sic.api.error.unknown;
        result.message = err.data.Message;
      }

      //result.error = err.data;
    }else{
      /*console.error('--->'+err.name);*/
      result.code = sic.api.error.unknown;
      result.message = err.name;
    }
    //console.info('----1111----------'+result);
    //return result;
  }
  return result;
}

/**
 *
 * @param mobile
 * @param code
 * @param tplCode
 * @param country
 * @returns {boolean}
 */
async function verifyMobileCode(name,mobile,code,country = 86,tplCode = sic.sms.code.tplCode){
  let result = {
    success:false,
    message:''
  };

  let cacheKey = tplCode+country+mobile;

  let oldValue = memCacheService.get(cacheKey);
  if(oldValue != null){
    if(oldValue === code){
      let tran = await eosService.setAccountMobile(name,mobile,country);
      if(tran && tran.transaction_id){
        memCacheService.remove(cacheKey);
      }
      result.success = true;
    }else{
      result.code = sic.api.error.sms.code_error;
      result.message = 'code error,try again!';
    }
  }else{
    result.code = sic.api.error.sms.code_timeout;
    result.message = 'Please get a new code';
  }
  return result;
}

module.exports = {
  smsService:{
    sendVerifyMobileCode:sendVerifyMobileCode,
    verifyMobileCode:verifyMobileCode
  }
}
