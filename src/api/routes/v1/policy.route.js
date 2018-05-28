const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/policy.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const {
  applyTrust,trustPolicy,
} = require('../../validations/policy.validation');

const router = express.Router();

console.debug(ADMIN);
console.debug(LOGGED_USER);

//router.param('accountName', controller.loadAccount);
router.param('accountPolicy', controller.loadPoliciesByAccount);
router.param('accountReview', controller.loadReviewPoliciesByAccount);



router.route('/unapprove/list')
  /**
   * @api {get} v1/policy/unapprove/list Get unapprove list
   * @apiDescription Get unapprove list
   * @apiVersion 1.0.0
   * @apiName PolicyList
   * @apiGroup Policy
   *
   * @apiParam  {Number{-1-}}      [limit=10]              Accounts per page
   * @apiParam  {Number{0-}}      [lowerBound=0]           List page
   *
   *
   * @apiSuccessExample {json} Success:
   *{
   *   "success": true,
   *   "code": 200,
   *   "data": {
   *       "rows": [
   *           {
   *               "ID": "15247299949142",
   *               "producer": "zrm",
   *               "upload_num": 1,
   *               "upload_time": "2018-05-03T03:33:32"
   *           },
   *           {
   *               "ID": "15247299949143",
   *               "producer": "zrm",
   *               "upload_num": 1,
   *               "upload_time": "2018-05-03T03:33:38"
   *           }
   *       ],
   *       "more": false
   *   }
   *}
   *
   */
  .get(controller.unapprovePolicyList);


router
  .route('/trust')
  .get(authorize(), validate(trustPolicy), controller.trust)
  /**
   * api {post} v1/policy/trust Trust policy:remove
   * apiDescription 保单托管
   * apiVersion 1.0.0
   * apiName TrustPolicy
   * apiGroup Policy
   *
   *
   * apiParam  {String}             entity=policy  实体
   * apiParam  {String}             type=LIHI 类型
   * apiParam  {String}             version=1.0.0 版本
   * apiParam  {Object}             header  header
   * apiParam  {String}  [header.HIP010001]    保单号
   * apiParam  {String}  [header.HIP010002]    被保人姓名-被保人证件号-被保人证件类型
   * apiParam  {Object}             body    Object
   * apiParam  {String}  [body.policyNo]    保单号
   * apiParam  {String}  [body.groupNo]     团单号
   * apiParam  {String}  [body.policyType]  保单类型
   * apiParam  {String}  [body.insurerName] 保险公司
   * apiParam  {String}  [body.insurerCode] 保险公司代码
   * apiParam  {Date}    [body.effectiveTime] 保单生效时间
   * apiParam  {Date}    [body.terminalTime] 保单终止时间
   * apiParam  {String}  [body.applicantName] 投保人姓名
   * apiParam  {String}  [body.applicantGender] 投保人性别
   * apiParam  {String}  [body.applicantCertNo] 投保人证件号
   * apiParam  {String}  [body.applicantCertType] 投保人证件类型
   * apiParam  {String}  [body.insuredName] 被保人
   * apiParam  {String}  [body.insuredGender] 被保人性别
   * apiParam  {String}  [body.insuredCertNo] 被保人证件号
   * apiParam  {String}  [body.insuredCertType] 被保人证件类型
   * apiParam  {String}  [body.insuredApplicant] 投保人与主被保人关系
   * apiParam  {Array}   [body.joint] 连带被保人
   * apiParam  {String}   [body.joint.insuredJoint] 连带人与主被保人关系
   * apiParam  {String}   [body.joint.jointName] 连带被保人姓名
   * apiParam  {String}   [body.joint.jointGender] 连带被保人性别
   * apiParam  {String}   [body.joint.jointCertNo] 连带被保人证件号
   * apiParam  {String}   [body.joint.jointCertType] 连带被保人证件类型
   * apiParam  {Array}   [body.beneficiary] 受益人
   * apiParam  {String}  [body.beneficiary.insuredBene] 受益人与主被保人关系
   * apiParam  {String}  [body.beneficiary.beneName] 受益人姓名
   * apiParam  {String}  [body.beneficiary.beneGender] 受益人性别
   * apiParam  {String}  [body.beneficiary.beneCertNo] 受益人证件号
   * apiParam  {String}  [body.beneficiary.beneCertType] 受益人证件类型
   * apiParam  {String}  [body.beneficiary.beneOrder] 受益人顺序代码
   * apiParam  {Array}   [body.coverage] 险种
   * apiParam  {String}  [body.coverage.coverageNo] 险种编号
   * apiParam  {String}  [body.coverage.coverageCode] 险种编码（条款编号）
   * apiParam  {String}  [body.coverage.coverageMount] 基本保额
   * apiParam  {String}  [body.coverage.accPaymentAmount] 累计赔付金额
   * apiParam  {String}  [body.coverage.accPaymentCount] 累计赔付次数
   * apiParam  {String}  [body.coverage.waitDays] 等待期天数
   * apiParam  {String}  [body.coverage.startDate] 险种生效日期
   * apiParam  {String}  [body.coverage.endDate] 险种满期日期
   * apiParam  {String}  [body.coverage.payPeriod] 交费期间
   * apiParam  {String}  [body.coverage.payPeriodCode] 交费期间类型代码
   * apiParam  {String}  [body.coverage.insurePeriod] 保险期间
   * apiParam  {String}  [body.coverage.insurePeriodCode] 保险期间类型代码
   * apiParam  {String}  [body.coverage.liability] 险种责任
   * apiParam  {String}  [body.coverage.liability.liabilityNo] 责任编号
   * apiParam  {String}  [body.coverage.liability.liabilityName] 责任名称
   * apiParam  {String}  [body.coverage.liability.liabilityCode] 责任类别代码
   * apiParam  {String}  [body.coverage.liability.effectiveTime] 责任生效时间
   * apiParam  {String}  [body.coverage.liability.terminalTime] 责任终止时间
   * apiParam  {String}  [body.coverage.liability.exclusureDays] 免责期天数
   * apiParam  {String}  [body.coverage.liability.exclusureCode] 免赔类型代码
   * apiParam  {String}  [body.coverage.liability.exclusureAmount] 免赔额
   * apiParam  {String}  [body.coverage.liability.paymentRatio] 赔付比例
   * apiParam  {Array}   body.file    保单影像文件
   * apiParam  {String}  body.file.fileHash    文件hash值
   * apiParam  {String}  body.file.fileUrl     文件Url
   * apiParam  {Number}  body.file.fileOrder   文件序号
   *
   *
   * apiExample {curl} Example usage:
   *    curl -X POST \
   *     http://10.3.1.135:3000/v1/policy/trust \
   *     -H 'Cache-Control: no-cache' \
   *     -H 'Content-Type: application/json' \
   *     -d '{"entity":"policy","type":"HI","version":"1.0.1","header":{"HIP010001":"PO111111111111","HIP010002":"111111111111222222221","HIP010003":"众安","HIP010004":"张锐敏-11111222-i"},"body":{}}'
   *
   *
   * apiSuccessExample {json} Success:
   * {
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "transaction_id": "62328770e5174a688a1e549e14011f22798fc525e2f2dac7449205e6b60811c5",
   *        "broadcast": true,
   *        "transaction": {
   *            "ref_block_num": 41730,
   *            "ref_block_prefix": 4162572231,
   *            "expiration": "2018-04-10T06:09:54",
   *            "scope": [
   *                "inita",
   *                "sic.policy.hi"
   *            ],
   *            "read_scope": [],
   *            "messages": [
   *                {
   *                    "code": "sic.policy.hi",
   *                    "type": "hipolicy",
   *                    "authorization": [
   *                        {
   *                            "account": "inita",
   *                            "permission": "active"
   *                        }
   *                    ],
   *                    "data": {
   *                        "policyID": "policyID",
   *                        "info": {
   *                            "producer": "inita",
   *                            "value": "{\"entity\":\"policy\",\"type\":\"HI\",\"version\":\"1.0.1\",\"header\":{\"HIP010001\":\"PO111111111111\",\"HIP010002\":\"111111111111222222221\",\"HIP010003\":\"众安\",\"HIP010004\":\"张锐敏-11111222-i\"},\"body\":{}}"
   *                        }
   *                    }
   *                }
   *            ],
   *            "signatures": [
   *                "2008da0987358b88ada394032a15a22406570196fa6680e9e252f40a7903929e0e2d574d0215969c531eba38a2f35f99aee729cd93a4515546054b6253dde12980"
   *            ]
   *        }
   *    }
   * }
   *
   */
  .post(controller.trust);

router
  .route('/list/:accountPolicy')
  /**
   * @api {get} v1/policy/list/:accountPolicy User's Get uploaded policies
   * @apiDescription User's uploaded policies
   * @apiVersion 1.0.0
   * @apiName AccountPolicyList
   * @apiGroup Policy
   *
   *
   *
   * @apiParam  {Number{-1-}}      [limit=10]              Accounts per page
   * @apiParam  {Number{0-}}      [lowerBound=0]           List page
   *
   *
   *
   * @apiSuccessExample {json} Success:
   * {
   *     "success": true,
   *     "code": 200,
   *     "data": {
   *         "rows": [
   *            {
   *                 "ID": "15247299949148",
   *                 "status": 10,
   *                 "ossAddr": "{\"id\":1524885717006,\"num\":3,\"files\":[{\"name\":\"64.png\",\"md5\":\"yqstxZHE9OvDkst4FzaVKg==\",\"path\":\"1524885717006/64.png\"},{\"name\":\"100.png\",\"md5\":\"aLrSCLUR2F1cth7m+lKv1A==\",\"path\":\"1524885717006/100.png\"},{\"name\":\"108.png\",\"md5\":\"N3heWRtjVbZXl0FdZB4A4w==\",\"path\":\"1524885717006/108.png\"}]}",
   *                 "producer": "zrm",
   *                 "reviewer": "eos",
   *                 "upload_num": 1,
   *                 "upload_time": "2018-05-03T05:43:44",
   *                 "reveiwing_time": "2018-05-03T05:43:52",
   *                 "approved_time": "1970-01-01T00:00:00",
   *                 "policyID": "",
   *                 "value": ""
   *             },
   *             {
   *                 "ID": "15247299949149",
   *                 "status": 0,
   *                 "ossAddr": "{\"files\":[{\"name\":\"64.png\",\"md5\":\"yqstxZHE9OvDkst4FzaVKg==\",\"path\":\"1524885717006/64.png\"},{\"name\":\"100.png\",\"md5\":\"aLrSCLUR2F1cth7m+lKv1A==\",\"path\":\"1524885717006/100.png\"},{\"name\":\"108.png\",\"md5\":\"N3heWRtjVbZXl0FdZB4A4w==\",\"path\":\"1524885717006/108.png\"}]}",
   *                 "producer": "zrm",
   *                 "reviewer": "",
   *                 "upload_num": 1,
   *                 "upload_time": "2018-05-03T05:44:22",
   *                 "reveiwing_time": "1970-01-01T00:00:00",
   *                 "approved_time": "1970-01-01T00:00:00",
   *                 "policyID": "",
   *                 "value": ""
   *             }
   *         ],
   *         "more": true
   *     }
   * }
   *
   */
  .get(controller.getPolicyByAccount);




router
  .route('/account/:account/:applyId')
  /**
   * @api {get} v1/policy/account/:account/:applyId Get a policy
   * @apiDescription Get accout's policy by applyId
   * @apiVersion 1.0.0
   * @apiName AccountPolicy
   * @apiGroup Policy
   *
   *
   * @apiParam  {String}      account           account's name
   * @apiParam  {String}      applyId           user apply id
   *
   * @apiSuccessExample {json} Success:
   * {
   *     "success": true,
   *     "code": 200,
   *     "data": {
   *         "ID": "1526435522476",
   *         "type": 1,
   *         "status": 20,
   *         "ossAddr": "{\"files\":[{\"name\":\"1526435522476.jpeg\",\"md5\":\"d7cq8YBZbcQlTP6mcYMgHg==\",\"path\":\"1526435522476/1526435522476.jpeg\"},{\"name\":\"1526435522477.jpeg\",\"md5\":\"ohY3mmPJMZGPi1rKUSGZGw==\",\"path\":\"1526435522476/1526435522477.jpeg\"}]}",
   *         "producer": "tt",
   *         "reviewer": "test",
   *         "upload_num": 2,
   *         "upload_time": "2018-05-16T01:52:07",
   *         "reveiwing_time": "2018-05-16T02:42:02",
   *         "approved_time": "2018-05-16T02:44:58",
   *         "policyID": "777",
   *         "value": "BMd7Ulczn+16AOAK53WZDf1SCw3P/5BY8GDgAoEFXCgla84eBIN4kLM70af+y/if6XRBZAFPsT15JRySPe4BcXW8msdIunzUUINB4Vlt+vu+ktvAqI2imYerwRgxGW7u536e2zlcQMvJPudtE8BW6EGYZDuuzOjtK71d9Dx4YsBbRWa4p6p3fixgWXlQILlMpg=="
   *     }
   * }
   *
   */
  .get(controller.getAccountPolicyByApplyId);

router
  .route('/review/:accountReview')
  /**
   * @api {get} v1/policy/review/:accountReview Auditor reviewed policies
   * @apiDescription Auditor reviewed policies
   * @apiVersion 1.0.0
   * @apiName AccountReviewPolicyList
   * @apiGroup Policy
   *
   *
   *
   * @apiParam  {Number{-1-}}      [limit=10]              Accounts per page
   * @apiParam  {Number{0-}}      [lowerBound=0]           List page
   *
   *
   *
   * @apiSuccessExample {json} Success:
   *{
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "rows": [
   *            {
   *                "ID": "15247299949147",
   *                "producer": "zrm",
   *                "files": [
   *                    {
   *                        "name": "64.png",
   *                        "md5": "yqstxZHE9OvDkst4FzaVKg==",
   *                        "path": "1524885717006/64.png",
   *                        "url": "http://sic-file-dev.oss-cn-beijing.aliyuncs.com/1524885717006/64.png?OSSAccessKeyId=LTAIGl4F7vNnQnpT&Expires=1525749043&Signature=enoacoEzEAE7sWtq4JdW4U5Ej88%3D"
   *                    },
   *                    {
   *                        "name": "100.png",
   *                        "md5": "aLrSCLUR2F1cth7m+lKv1A==",
   *                        "path": "1524885717006/100.png",
   *                        "url": "http://sic-file-dev.oss-cn-beijing.aliyuncs.com/1524885717006/100.png?OSSAccessKeyId=LTAIGl4F7vNnQnpT&Expires=1525749043&Signature=fOY3BsbO14fVofoY%2B1VZ2yQnjbs%3D"
   *                    },
   *                    {
   *                        "name": "108.png",
   *                        "md5": "N3heWRtjVbZXl0FdZB4A4w==",
   *                        "path": "1524885717006/108.png",
   *                        "url": "http://sic-file-dev.oss-cn-beijing.aliyuncs.com/1524885717006/108.png?OSSAccessKeyId=LTAIGl4F7vNnQnpT&Expires=1525749043&Signature=EzSyRmN12Pk%2FqWATsNV%2FAvnqkCI%3D"
   *                    }
   *                ]
   *            },
   *            {
   *                "ID": "15247299949148",
   *                "producer": "zrm",
   *                "files": [
   *                    {
   *                        "name": "64.png",
   *                        "md5": "yqstxZHE9OvDkst4FzaVKg==",
   *                        "path": "1524885717006/64.png",
   *                        "url": "http://sic-file-dev.oss-cn-beijing.aliyuncs.com/1524885717006/64.png?OSSAccessKeyId=LTAIGl4F7vNnQnpT&Expires=1525749043&Signature=enoacoEzEAE7sWtq4JdW4U5Ej88%3D"
   *                    },
   *                    {
   *                        "name": "100.png",
   *                        "md5": "aLrSCLUR2F1cth7m+lKv1A==",
   *                        "path": "1524885717006/100.png",
   *                        "url": "http://sic-file-dev.oss-cn-beijing.aliyuncs.com/1524885717006/100.png?OSSAccessKeyId=LTAIGl4F7vNnQnpT&Expires=1525749043&Signature=fOY3BsbO14fVofoY%2B1VZ2yQnjbs%3D"
   *                    },
   *                    {
   *                        "name": "108.png",
   *                        "md5": "N3heWRtjVbZXl0FdZB4A4w==",
   *                        "path": "1524885717006/108.png",
   *                        "url": "http://sic-file-dev.oss-cn-beijing.aliyuncs.com/1524885717006/108.png?OSSAccessKeyId=LTAIGl4F7vNnQnpT&Expires=1525749043&Signature=EzSyRmN12Pk%2FqWATsNV%2FAvnqkCI%3D"
   *                    }
   *                ]
   *            }
   *        ],
   *        "more": false
   *    }
   *}
   *
   */
  .get(controller.getReviewPolicyByAccount);

router
  .route('/search')
  /**
   * @api {get} v1/policy/search Search policies
   * @apiDescription Search policies
   * @apiVersion 1.0.0
   * @apiName SearchPolicy
   * @apiGroup Policy
   *
   * @apiParam  {String}      searchKey        searchKey
   * @apiParam  {Number{1-}}  [page=1]           request page
   * @apiParam  {Number{1-}}  [pageNum=100]      count per page
   *
   *
   * @apiSuccessExample {json} Success:
   *{
   *    "success": true,
   *    "code": 200,
   *    "data": {
   *        "count": 15,
   *        "page": 1,
   *        "pageNum": 1,
   *        "pageCount": 15,
   *        "records": [
   *            {
   *                "action_id": 0,
   *                "transaction_id": "ab3b66c5011e8c46237dbe0117109cd7d38399c8b9a3f4f8345611bea4131319",
   *                "authorization": [
   *                    {
   *                        "actor": "ts",
   *                        "permission": "active"
   *                    }
   *                ],
   *                "handler_account_name": "sic.policy",
   *                "name": "approved",
   *                "data": {
   *                    "param5": "param5",
   *                    "param4": "param4",
   *                    "param3": "param3",
   *                    "param2": "param2",
   *                    "param1": "param1",
   *                    "type": "policy",
   *                    "account": "eos",
   *                    "value": "{DDD:1121,NAME:ZM LJKKKSD}",
   *                    "policyID": "1233",
   *                    "ID": "15247299949004"
   *                },
   *                "createdAt": "2018-05-10T03:12:10.002Z"
   *            }
   *        ]
   *    }
   *}
   *
   *
   */
  .get(controller.loadPolicesByKey);

router
  .route('/rewards/:applyId/:user/:auditor')
  /**
   * @api {get} v1/policy/rewards/:applyId/:user/:auditor Reward
   * @apiDescription Reward
   * @apiVersion 1.0.0
   * @apiName PolicyRewards
   * @apiGroup Policy
   *
   * @apiParam  {String}      applyId        User's apply id
   * @apiParam  {String}      user           User's account
   * @apiParam  {String}      auditor        Auditor's account
   *
   *
   * @apiSuccessExample {json} Success:
   * {
   *    "success": true,
   *    "code": 200,
   * }
   *
   *
   */
  .get(controller.rewards);

module.exports = router;
