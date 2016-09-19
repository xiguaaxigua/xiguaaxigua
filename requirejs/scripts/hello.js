define('hello', [], function() {
    var hello = 'Hello';
    var getHello = function() {
        return hello;
    }

    return {
        getHello: getHello
    }
});
