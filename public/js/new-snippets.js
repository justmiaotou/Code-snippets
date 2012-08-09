(function() {
    var getByTag = function(tagName) {
        return Array.prototype.slice.call(document.getElementsByTagName(tagName));
    };
    var form = obj('#snippet-form');
    addEvent(form, 'click', function(e) {
        var target = getTarget(getEvent(e));
        if (/del-field-btn/.test(target.className)) {
            var p = target.parentNode;
            p.parentNode.removeChild(p);
        }
    });
    addEvent(obj('.add-code-btn', form)[0], 'click', function(e) {
        preventDefault(e);
        var fragment = document.createDocumentFragment(),
            li = document.createElement('li'),
            type = form.codetype.value;
        li.innerHTML = '<label class="ib th">' + type + '：</label><textarea name="' + type.toLowerCase() + '-code" class="code txt"></textarea><span class="del-field-btn">x</span>';
        fragment.appendChild(li);
        obj('.form-list', form)[0].insertBefore(fragment, this.parentNode);
    });

    addEvent(obj('#show-effect'), 'click', function() {
        var idInput = obj('#effect-btn-id');
        if (this.checked) {
            idInput.disabled = false;
        } else {
            idInput.disabled = true;
        }
    });

    addEvent(obj('#snippet-submit'), 'click', function(e) {
        preventDefault(e);
        checkForm() && ajax({
            url: '/snippet-upload'
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

    function checkForm() {
        return modArrItem(getByTag('input').concat(getByTag('textarea')), function() {
            if (this.hasAttribute('required') && this.value == '') {
                alert('请将必填项补充完整。');
                return false;
            }
        });
    }
})();
