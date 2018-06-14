const path = require('path');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

// SMTP mail setup
// Default to ehtereal to keep from breaking things, which
// will just send emails to the void
let mail = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};



module.exports = {
  chain:{
    eos:{code:'eos',name:'eos'},
    eth:{code:'eth',name:'eth'}
  },
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtSecret: 'jwtSecret',
  jwtExpirationInterval: 0,
  mongo: {
    uri: process.env.MONGO_URI,
    uri2: process.env.MONGO_URI2,
  },

  aliyun:{
    oss:{
      region:          process.env.ALI_OSS_REGION,
      accessKeyId:     process.env.ALI_OSS_ACCESSKEY,
      accessKeySecret: process.env.ALI_OSS_ACCESSKEY_SECRET,
      bucket:          process.env.ALI_OSS_BUCKET,
    },
    sms:{
      accessKeyId:     process.env.ALI_SMS_ACCESSKEY,
      accessKeySecret: process.env.ALI_SMS_ACCESSKEY_SECRET
    }
  },
  sicAccount:{
    account:{
      accountInfo:{
        name:   process.env.SIC_ACCOUNT_INFO_NAME,
        priKey: process.env.SIC_ACCOUNT_INFO_SECRET
      },
      creator:{
        name: process.env.SIC_ACCOUNT_CREATOR,
        priKey: process.env.SIC_ACCOUNT_CREATOR_SECRET
      }
    }
  }
  ,
  service_name: process.env.SERVICE_NAME,
  mail,
  eosd: {
    chainId: process.env.EOSD_CONNECTOR_CHAIN_ID,
    uri: process.env.EOSD_CONNECTOR_URI,
  },
  ethUrl:process.env.ETH_CONNECTOR_URI,
  chain_id: process.env.ETH_CHAIN_ID,
  gas_price: process.env.ETH_GAS_PRICE,
  gas_limit: process.env.ETH_GAS_LIMIT,
  faucet: {
    notify: process.env.FAUCET_NOTIFY_ADDRESS,
    fromAddress: process.env.FAUCET_FROM_ADDRESS,
  },
  logs: process.env.NODE_ENV === 'prd' ? 'combined' : 'dev'
};
