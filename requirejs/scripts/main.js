(function(){

	require.config({
		baseUrl: 'scripts'
	});

	require(['alert'], function(alert){
		alert.sayHi();
	});
})();