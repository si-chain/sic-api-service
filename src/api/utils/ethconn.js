const { ethUrl } = require('../../config/vars');
var Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider(ethUrl));

module.exports = web3;
