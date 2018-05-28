# SIC API Services

## Getting Started

```bash
$ git clone https://github.com/si-chain/sic-api-service/sic-api-service.git
$ cd sic-api-service
$ cp .env.example .env
```

## Configuration (.env)
The API services are configured through a local `.env` file.  The standard setup is as follows:

```
NODE_ENV=dev
PORT=3000

#MONGO
MONGO_URI=mongodb://root:password@2ze8f5e1c0993b9433310.mongodb.sic.com:3717/chain
MONGO_URI2=mongodb://root:password@2ze8f5e1c0993b9433311.mongodb.sic.com:3717/user

#eosd
EOSD_CONNECTOR_URI=http://10.3.0.29:8888

#ALI_OSS
ALI_OSS_REGION=aaaaaaaaaa
ALI_OSS_ACCESSKEY=dddddddd
ALI_OSS_ACCESSKEY_SECRET=ddfaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
ALI_OSS_BUCKET=sic-file-dev

#ALI_SMS
ALI_SMS_ACCESSKEY=ddddddd
ALI_SMS_ACCESSKEY_SECRET=aaaaaaaaaaaa

#SIC ACCOUNT
##Creator
SIC_ACCOUNT_CREATOR=eosio
SIC_ACCOUNT_CREATOR_SECRET=5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
##Info
SIC_ACCOUNT_INFO_NAME=account.info
SIC_ACCOUNT_INFO_SECRET=5KBTDMFHVzV5oouaMNKzqFjdCdk9PGBDaQJho3ZpmLnRhvPxuAq

# Ethereum
ETH_CONNECTOR_URI=http://10.3.2.188:8545
ETH_CHAIN_ID=50697
ETH_GAS_PRICE=1
ETH_GAS_LIMIT=auto
```

You can set the `NODE_ENV` to which ever environment you're running in (`prd` or `dev` or `test`) and the port. 

The `MONGO_URI` should point to the same mongodb host that the particular eosd node you are connecting to is writing out to.  That
eosd node and the api service share this datbase. 

## Running
Once configured, you can get the API Service up and running using the following:

```bash
$ yarn
$ yarn docs
$ yarn start
```

Running `yarn start` will run the service using pm2 and with `NODE_ENV=prd`. The command `yarn docs` generates the API documentation
which is available from the running API service at `/v1/docs`.  You can get a simple status of the API service by performing a `GET` on the 
`/v1/status` endpoint which should return a 200 Ok.
