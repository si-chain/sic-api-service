'use strict';
/**************************memoryCache*******************************/
const mcache = require('memory-cache');
/**
 *
 * @param key
 * @returns {*}
 */
function getFromMemory(key){
  return mcache.get(key);
}

function putToMemory(key,value,seconds){
  return mcache.put(key,value,seconds*1000);
}

function removeFromMemory(key) {
  return mcache.del(key);
}

function statMemoryCache() {
  console.info(mcache.exportJson());
  console.info(mcache.hits());
}
/*********************************************************/

module.exports = {
  memCacheService:{
    get:getFromMemory,
    put:putToMemory,
    remove:removeFromMemory,
    stat:statMemoryCache
  }
};
