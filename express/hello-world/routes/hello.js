var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('hello', {welcome: 'welcome', message: 'Hello World!'});
});

module.exports = router;