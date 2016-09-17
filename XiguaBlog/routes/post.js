var express = require('express');
var router  = express.Router();

router.get('/', function (req, res) {
  res.render('post', {title: 'post'});	
});

module.exports = router;