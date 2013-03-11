(function() {
    var define = M.define,
        require = M.require;
var $ = M.dom,
    ajax = M.ajax;

var multiOption = $('.multi-option'),
    optList = $('#opt-list'),
    voteForm = $('#snippet-form'),
    optCount = optList.children('li').length - 1,
    optTpl = '<li><input name="opt-<%= index %>" required class="txt"><span class="del-opt tst-all-01">x</span></li>';

$('#radio-multi').on('change', function() {
    if (this.checked) {
        multiOption.show();
    } else {
        multiOption.hide();
    }
});

optList.delegate('.del-opt', 'click', function() {
    $(this).parent().remove();
});

$('.add-opt-btn').on('click', function() {
     $(this)
        .parent('li')
        .before($.create(M._.template(optTpl)({
            index: optCount
         })));

     optCount++;
});

voteForm.on('submit', function() {
    ajax({
        url: '/vote/new',
        form: voteForm[0],
        on: {
            complete: function(data, xhr) {
            }
        }
    });
});
})();
