define(function(require, exports, module) {
    var _ = require('./common'),
        $ = _.$,
        addEvent = _.addEvent,
        config = editConfig,
        form = $('#snippet-form');
    addEvent($('#del-snippet'), 'click', function() {
        if (window.confirm('确定删除该条目？')) {
            _.getJSON(this.getAttribute('data-href'), function(data) {
                if (data.status) {
                    alert('删除成功！页面即将关闭！');
                    window.close();
                } else {
                    alert(data.msg);
                }
            });
        }
    });
    addEvent(form, 'click', function(e) {
        var target = _getTarget(_getEvent(e));
        if (/del-field-btn/.test(target.className)) {
            var p = target.parentNode;
            p.parentNode.removeChild(p);
        }
    });
    addEvent($('.add-code-btn', form)[0], 'click', function(e) {
        _.preventDefault(e);
        var fragment = document.createDocumentFragment(),
            li = document.createElement('li'),
            type = form.codetype.value;
        li.innerHTML = '<label class="ib th">' + type + '：</label><textarea name="' + type.toLowerCase() + '-code" class="code txt"></textarea><span class="del-field-btn">x</span>';
        fragment.appendChild(li);
        $('.form-list', form)[0].insertBefore(fragment, this.parentNode);
    });

    addEvent($('#show-effect'), 'click', function() {
        var idInput = $('#effect-btn-id');
        if (this.checked) {
            idInput.disabled = false;
        } else {
            idInput.disabled = true;
        }
    });

    addEvent($('#snippet-submit'), 'click', function(e) {
        _.preventDefault(e);
        _.checkForm() && _.ajax({
            // url: '/snippet-upload'
            url: config.url
            , form: form
            , blackList: ['codetype']
            , on : {
                // TODO 无效
                start: function(o, data, args) {
                    console.log('start');
                    var tmpFieldArr = data.split('&'),
                        hasCode = false,
                        tmpField;
                    for (var i = 0, l = tmpFieldArr.length; i < l; ++i) {
                        tmpField = tmpFieldArr[i].split('=');
                        console.log(tmpField);
                    }
                },
                complete: function(o, args) {
                    var res = JSON.parse(o.responseText);
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
});
