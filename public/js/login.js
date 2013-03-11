(function() {
    var define = M.define,
        require = M.require;
define('snippet-common', function(require, exports, module) {
    var $ = M.dom;

    module.exports = {
        checkForm: checkForm
    };

    /**
     * 对表单的简单验证
     */
    function checkForm() {
        var elements = $('input[required], textarea[required]'),
            error = [];

        M._.each(elements, function(ele) {
            if (/^\s*$/.test(ele.value)) {
                error.push('请将必填项补充完整。');
            }
        });

        var pws = $('input[type=password]');
        if (pws.length == 2) {
            if (pws[0].value !== pws[1].value) {
                error.push('两次密码输入不一致');
            }
        }

        if (error.length) {
            alert(error[0]);
            return false;
        }

        return true;
    }
});
})();
(function() {
    var define = M.define,
        require = M.require;
var _ = require('snippet-common'),
    $ = M.dom;

var form = $('#main-form'),
    passwd = $('#passwd'),
    params = M.util.getQuery();

form.on('submit', function(e) {
    if (!checkForm()) {
        E.preventDefault(e);
        return false;
    }
});

if (params.redirect) {
    $('#redirect').value = params.redirect;
}

handleError();

function handleError() {
    if (!params.error) return;
    switch(params.error) {
        case 'pw':
            showError('密码错误，请重试');
            passwd[0].focus();
            break;
        case 'un':
            showError('用户名不存在，请重试');
            break;
        case 'not_login':
            showError('请先登录！');
            break;
    }
}
function showError(msg) {
    alert(msg);
}
})();
