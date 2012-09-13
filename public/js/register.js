(function() {
    addEvent($('.submit')[0], 'click', function(e) {
        preventDefault(e);
        console.log('submit');
    });
})();
