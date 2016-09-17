// 依赖
var express     = require('express');
var path        = require('path');
var favicon     = require('serve-favicon');
var logger      = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser  = require('body-parser');
var crypto      = require('crypto'); // 加密密码

// routes
var routes      = require('./routes/index');
var users       = require('./routes/users');
var hello       = require('./routes/hello');
var login       = require('./routes/login');
var logout      = require('./routes/logout');
var reg         = require('./routes/reg');
var post        = require('./routes/post');

// models
var User = require('./models/user.js'); 

var settings    = require('./settings'); // 配置
var session     = require('express-session');
var MongoStore  = require('connect-mongo')(session);
var flash       = require('connect-flash');

var app = express();

// 视图目录
app.set('views', path.join(__dirname, 'views'));
// 模板引擎
app.set('view engine', 'ejs');
// flash
app.use(flash());

// uncomment after placing your favicon in /public
// favicon图标
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 日志
app.use(logger('dev'));
// json 
app.use(bodyParser.json());
// 解析url
app.use(bodyParser.urlencoded({ extended: false }));
// cookie
app.use(cookieParser());
// 静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制器
app.use('/', routes);
app.use('/users', users);
app.use('/hello', hello);
app.use('/login', login);
app.use('/logout', logout);
app.use('/reg', reg);
app.use('/post', post);

// 注册
app.post('/reg', function (req, res) {
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'];
  //检验用户两次输入的密码是否一致
  if (password_re != password) {
    req.flash('error', '两次输入的密码不一致!'); 
    return res.redirect('/reg');//返回注册页
  }
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
  });
  //检查用户名是否已经存在 
  User.get(newUser.name, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');//返回注册页
    }
    //如果不存在则新增用户
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');//注册失败返回主册页
      }
      req.session.user = newUser;//用户信息存入 session
      req.flash('success', '注册成功!');
      res.redirect('/');//注册成功后返回主页
    });
  });
});

// session
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db, // cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30}, // 30天
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));

// 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// dev error
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;