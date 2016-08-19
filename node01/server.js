var http = require('http'),
	url = require('url');

function start(route){
	http.createServer(function(req, res){
		var pathName = url.parse(req.url).pathname;
		console.log('Request for ' + pathName + 'Received.');

		route(pathName);

		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write('Hello Wrold!');
		res.end();
	}).listen(8888);

	console.log('ok!');
}

exports.start = start;