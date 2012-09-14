var crypto = require('crypto'),
    config = require('./config');

exports.modArrItem = modArrItem;
exports.parseQuery = parseQuery;
exports.md5 = md5;
exports.md5WithSalt = md5WithSalt;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.encryptSessionId = encryptSessionId;
exports.decryptSessionId = decryptSessionId;

/**
 * 对数组的指定连续部分进行修改。
 * 若有回调函数的返回值为false，则不对余下的数组成员调用回调函数而直接返回false。
 * @param {Array} arr 操作的对象数组
 * @param {Function} callback 应用于对象数组每个成员的回调函数，this值为相应成员
 * @param {Number} from [option]应用回调的起始成员序号
 * @param {Number} to [option]应用回调的结束成员序号
 */
function modArrItem(arr, callback, from, to) {
    !from && (from=0);
    !to && (to=arr.length);
    for (;from < to; from++) {
        // 回调函数通过返回值控制流程
        if (callback.call(arr[from], arr[from], from, arr) === false) {
            return false;
        }
    }
    return true;
}

/**
 * 解析url中的查询字段
 * @param {String} query url中的查询字段，例如：'a=1&b=2&c=3'
 */
function parseQuery(query) {
    var arr = query ? query.split('&') : [],
        tmp = null,
        o = {};
    for (var i = 0, l = arr.length; i < l; ++i) {
        tmp = arr[i].split('=');
        tmp[0] != '' && (o[tmp[0]] = tmp[1]);
    }
    return o;
}

/**
 * md5加密 （不可逆）
 * @param {String} str 需要加密的字符串
 */
function md5(str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    return md5sum.digest('hex');
}

/**
 * 加盐版md5加密 （不可逆）
 * @param {String} str 需要加密的字符串
 */
function md5WithSalt(str, salt) {
    return md5(str + salt);
}

/**
 * 可逆加密
 * @param {String} str 需要加密字符串
 * @param {String} secret 貌似是‘加盐’
 * @return {String} 加密后字符串
 */
function encrypt(str,secret) {
    var cipher = crypto.createCipher('aes192', secret),
        enc = cipher.update(str,'utf8','hex');
    return (enc + cipher.final('hex'));
}

/**
 * 上面可逆加密的解密
 * @param {String} str 加密字符串
 * @param {String} secret 貌似是‘加盐’
 * @return {String} 解密后字符串
 */
function decrypt(str,secret) {
    var decipher = crypto.createDecipher('aes192', secret),
        dec = decipher.update(str,'hex','utf8');
    return (dec + decipher.final('utf8'));
}

function encryptSessionId(str) {
    return encrypt(str, config.session_secret);
}
function decryptSessionId(str) {
    return decrypt(str, config.session_secret);
}
