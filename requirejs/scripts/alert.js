define('alert', ['hello'], function(hello){
	var world = ' World!';
	var sayHi = function(){
		var msg = hello.getHello();
		alert(msg + world);
	}
	return {
		sayHi: sayHi
	};
});