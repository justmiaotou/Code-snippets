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
var common = require('snippet-common'),
    ajax = M.ajax,
    E = M.event,
    $ = M.dom;

var form = $('#main-form');

form.on('submit', function(e) {
    E.preventDefault(e);

    form[0].username.checkValidity && form[0].username.checkValidity();
    if (form[0].username.validity && form[0].username.validity.patternMismatch) {
        alert('用户名格式不正确！看不懂正则？那这里不适合你……');
        return;
    }
    common.checkForm() && ajax({
          url: '/register'
        , form: $('#main-form')[0]
        , blackList: ['pw-confirm']
        , on: {
            complete: function(res, xhr) {
                if (res.type != 0) {
                    alert(res.msg);
                } else {
                    alert('恭喜注册成功~将转至登录页登录！');
                    location.href = '/login';
                }
            }
        }
    });
});
})();
