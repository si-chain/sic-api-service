const AliOss = require('ali-oss');
const { aliyun } = require('./vars');

module.exports = {
  aliOssClient:AliOss({
    region: aliyun.oss.region,
    accessKeyId: aliyun.oss.accessKeyId,
    accessKeySecret: aliyun.oss.accessKeySecret,
    bucket: aliyun.oss.bucket
  })
}
