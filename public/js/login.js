(function() {
    var form = $('#main-form'),
        passwd = $('#passwd');
        params = parseURL().params;

    addEvent(form, 'submit', function(e) {
        if (!checkForm()) {
            preventDefault(e);
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
                passwd.focus();
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
