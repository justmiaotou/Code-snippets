(function() {
    var form = $('#main-form');
    addEvent($('.submit')[0], 'click', function(e) {
        preventDefault(e);
        checkForm() && form.submit();
    });
})();
