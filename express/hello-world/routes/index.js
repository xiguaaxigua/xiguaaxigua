// 加载依赖, 实例化一个路由用来捕获GET请求
var express = require('express');
var router = express.Router();

// index.jade
router.get('/', function(req, res, next) {
    // 渲染模板, 注册数据
    res.render('index', { title: 'Express' });
});

// hello.jade
router.get('/hello', function (req, res, next) {
    res.render('hello', { welcome: 'Hello World!' });
});

// 导出这个路由,并在app.js中通过 app.use('/', routes) 加载
module.exports = router;
