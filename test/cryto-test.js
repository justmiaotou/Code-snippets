var crypto = require('crypto');

/*for (var i in process.argv) {
    console.log(i+':'+process.argv[i]);
}*/

var pw = 'memomemo';

console.log('/**************************\\');
console.log('     crypto.createHash');
console.log('\\**************************/');
console.log('============md5=============');
// 不可逆加密
var md5sum = crypto.createHash('md5');
md5sum.update(pw);
md5sum.update('abc');
var md5str = md5sum.digest('hex'); // 'hex', 'binary'[default], 'base64'
console.log('length:'+md5str.length);
console.log(md5str);
var md5sum2 = crypto.createHash('md5');
md5sum2.update('memomemoabc');
var md5str2 = md5sum2.digest('hex');
console.log('length:'+md5str2.length);
console.log(md5str2);

console.log('============sha1============');
var sha1sum = crypto.createHash('sha1');
sha1sum.update(pw);
var sha1str = sha1sum.digest('hex');
console.log('length:'+sha1str.length);
console.log(sha1str);

console.log('============sha256==========');
var sha256sum = crypto.createHash('sha256');
sha256sum.update(pw);
var sha256str = sha256sum.digest('hex');
console.log('length:'+sha256str.length);
console.log(sha256str);

console.log('============sha512==========');
var sha512sum = crypto.createHash('sha512');
sha512sum.update(pw);
var sha512str = sha512sum.digest('hex');
console.log('length:'+sha512str.length);
console.log(sha512str);

console.log('/**************************\\');
console.log('     crypto.createHash');
console.log('\\**************************/');
// 可逆加密
var cipher = crypto.createCipher('aes192', pw),
    enc = cipher.update('50532494732f14c018000002', 'utf8', 'hex');
enc = cipher.final('hex');
console.log(enc);
console.log(decrypt(enc, pw));
function decrypt(str,secret) {
   var decipher = crypto.createDecipher('aes192', secret);
   var dec = decipher.update(str,'hex','utf8');
   dec += decipher.final('utf8');
   return dec;
}

var testObj = { a:1, b:2 };
Object.freeze(testObj);

testObj.a = 3;
console.log(testObj);
console.log(Object.isFrozen(testObj));
