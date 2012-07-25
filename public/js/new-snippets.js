(function() {
    var form = obj('#snippet-form');
    addEvent(obj('#snippet-submit'), 'click', function(e) {
        preventDefault(e);
        ajax({
            url: '/snippet-upload'
            , form: form
            , on : {
                complete: function(o, args) {
                    var res = JSON.parse(o.responseText);
                    switch(res.status) {
                        case 0:
                            alert('提交失败，请重试。');
                            break;
                        case 1:
                            alert('提交成功！');
                            form.reset();
                            break;
                    }
                }
            }
        });
    });
})();
