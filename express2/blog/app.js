var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');


var routes = require('./routes/index');
var settings = require('./settings');
var login = require('./routes/login');
var logout = require('./routes/logout');
var reg = require('./routes/reg');
var post = require('./routes/post');

var app = express();

// 路由控制器
app.use('/', routes);
app.use('/login', login);
app.use('/logout', logout);
app.use('/reg', reg);
app.use('/post', post);

// mongo
// app.use(session({
//     secret: settings.cookieSecret,
//     key: settings.db, //cookie name
//     cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 过期时间
//     store: new MongoStore({
//         db: settings.db,
//         host: settings.host,
//         port: settings.port
//     })
// }));

// 视图位置
app.set('views', path.join(__dirname, 'views'));
// 视图引擎
app.set('view engine', 'ejs');

app.use(flash());

// 图标
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// 日志中间件
app.use(logger('dev'));

// 解析JSON 
app.use(bodyParser.json());

// 解析URLencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie
app.use(cookieParser());

// 静态文件位置
app.use(express.static(path.join(__dirname, 'public')));

// 捕捉404错误
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 开发环境下的错误处理器
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产环境下的错误处理器
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// 导出app实例
module.exports = app;
