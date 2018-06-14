const Config = require('../../models/Config.model');

const c = new Config({
    key:'KEY_IS_NEED_INVITE_CODE',
    val:false,
});

c.save().then(() => console.log('meow'));