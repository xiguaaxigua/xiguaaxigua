var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){

	res.render('login', {title: 'This is Login Page!'});
});

module.exports = router;