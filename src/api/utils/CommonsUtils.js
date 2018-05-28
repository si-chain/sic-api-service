const UUID = require('uuid');

function uuid() {
  return UUID.v1().replace(/-/g,'');
}

/**
 *
 * @param length
 * @returns {number}
 */
function randomInt(length=4) {
  let min = 0;
  let max = 9;
  if(length > 0){
    if(length > 16){
      length = 16;
    }

    min = Math.pow(10,length-1);
    max = Math.pow(10,length)-1;
    //console.info(min+'--'+max);
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomIntStr(length = 4) {
  return ''+randomInt(length);
}


module.exports = {
  StringUtils:{
    uuid:uuid
  },
  RandomStringUtils:{
    /*randomAlphanumeric:randomAlphanumeric,
    randomAlphabetic:randomAlphabetic,*/
    randomInt:randomIntStr
  }
};
