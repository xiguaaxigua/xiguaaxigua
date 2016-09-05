var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){

	res.render('post', {title: 'This is Post Page!'});
});

module.exports = router;