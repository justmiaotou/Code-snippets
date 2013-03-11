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
var $ = M.dom,
    ajax = M.ajax,
    E = M.event,
    config = editConfig,
    common = require('snippet-common'),
    form = $('#snippet-form');

var btnDelSnippet = $('#del-snippet');
btnDelSnippet.length && btnDelSnippet.on('click', function() {
    if (window.confirm('确定删除该条目？')) {
        ajax.getJSON(this.getAttribute('data-href'), function(data) {
            if (data.status) {
                alert('删除成功！页面即将关闭！');
                window.close();
            } else {
                alert(data.msg);
            }
        });
    }
});

form.delegate('.del-field-btn', 'click', function(e) {
    $(this).parent().remove();
});

$('.add-code-btn', form).on('click', function(e) {
    E.preventDefault(e);
    var type = form[0].codetype.value;

    $(this).parent().before($.create('<li><label class="ib th">' + type + '：</label><textarea name="' + type.toLowerCase() + '-code" class="code txt"></textarea><span class="del-field-btn">x</span></li>'));
});

$('#show-effect').on('click', function() {
    var idInput = $('#effect-btn-id')[0];
    if (this.checked) {
        idInput.disabled = false;
    } else {
        idInput.disabled = true;
    }
});

$('#snippet-submit').on('click', function(e) {
    E.preventDefault(e);
    common.checkForm() && ajax({
        url: config.url
        , form: form[0]
        , blackList: ['codetype']
        , on : {
            // TODO 无效
            /*start: function(o, data, args) {
                console.log('start');
                var tmpFieldArr = data.split('&'),
                    hasCode = false,
                    tmpField;
                for (var i = 0, l = tmpFieldArr.length; i < l; ++i) {
                    tmpField = tmpFieldArr[i].split('=');
                    console.log(tmpField);
                }
            },*/
            complete: function(res, xhr) {
                switch(res.status) {
                    case 0:
                        alert(res.msg);
                        break;
                    case 1:
                        alert('提交成功！');
                        //form.reset();
                        break;
                }
            }
        }
    });
});
})();
