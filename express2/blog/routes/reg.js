var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){

	res.render('reg', {title: 'This is Reg Page!'});
});

module.exports = router;