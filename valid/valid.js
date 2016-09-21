(function() {

    function validator() {

    }

    validator.prototype = {
        _init: function() {
            console.log('init');
        },
        hello: function() {
            console.log('hello');
        }
    }
    var valid = new validator();
    console.log(valid);
	$.fn.validator = valid;
})();
