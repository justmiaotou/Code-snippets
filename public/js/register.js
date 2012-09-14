(function() {
    var form = $('#main-form');
    addEvent($('.submit')[0], 'click', function(e) {
        preventDefault(e);

        form.username.checkValidity && form.username.checkValidity();
        if (form.username.validity && form.username.validity.patternMismatch) {
            alert('用户名格式不正确！看不懂正则？那这里不适合你……');
            return;
        }
        checkForm() && ajax({
              url: '/register'
            , form: $('#main-form')
            , blackList: ['pw-confirm']
            , on: {
                complete: function(xhr) {
                    var res = JSON.parse(xhr.responseText);
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
