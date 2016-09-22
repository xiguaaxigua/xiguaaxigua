var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var Message = require('../models/message.js');

module.exports = function(app) {
    // 首页
    app.get('/', function(req, res) {
        Post.get(null, function(err, posts) {
            if (err) {
                posts = [];
            }
            res.render('index', {
                title: '主页',
                user: req.session.user,
                posts: posts,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    // 留言
    app.get('/message', function(req, res){
        Message.get(null, function(err, messages){
            if(err){
                messages = [];
            }
            res.render('message', {
                title: '留言板',
                user: req.session.user,
                messages: messages,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });
    app.post('/message', function(req, res){
        var name = req.body.name,
            time = req.body.time,
            content = req.body.content;
        var newMsg = new Message({
            name: name,
            time: time,
            content: content
        });
        newMsg.save(function(err, message){
            if(err){
                req.flash('error', err);
                return res.redirect('/message');
            }
            req.session.message = message;
            req.flash('success', '留言成功！');
            res.redirect('/');
        });
    });

    // 查看用户
    app.get('/look', function(req, res){
        User.look(null, function(err, users){
            if(err){
                users = [];
            }
            res.render('look', {
                title: '查看用户',
                user: req.session.user,
                users: users,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    // 查看男用户
    app.get('/lookMan', function(req, res){
        User.lookMan(null, function(err, users){
            if(err){
                users = [];
            }
            res.render('look', {
                title: '查看用户',
                user: req.session.user,
                users: users,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        })
    });

    // 注册
    app.get('/reg', checkNotLogin);
    app.get('/reg', function(req, res) {
        res.render('reg', {
            title: '注册',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/reg', checkNotLogin);
    app.post('/reg', function(req, res) {
        var name = req.body.name, // 接受post过来的用户信息
            sex = req.body.sex,
            password = req.body.password,
            password_re = req.body['password-repeat'],
            note = req.body.note;
        if (password_re != password) {
            req.flash('error', '两次输入的密码不一致!');
            return res.redirect('/reg');
        }
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        var newUser = new User({ // 调用User模型
            name: name,
            sex: sex,
            password: password,
            email: req.body.email,
            note: note
        });
        User.get(newUser.name, function(err, user) { // 获取信息
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            if (user) {
                req.flash('error', '用户已存在!');
                return res.redirect('/reg');
            }
            newUser.save(function(err, user) { // 保存数据
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/reg');
                }
                req.session.user = user;
                req.flash('success', '注册成功!');
                res.redirect('/');
            });
        });
    });

    // 登录
    app.get('/login', checkNotLogin);
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登录',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/login', checkNotLogin);
    app.post('/login', function(req, res) {
        var md5 = crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.name, function(err, user) {
            if (!user) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            if (user.password != password) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');
        });
    });

    // 发布
    app.get('/post', checkLogin);
    app.get('/post', function(req, res) {
        res.render('post', {
            title: '发表',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
    app.post('/post', checkLogin);
    app.post('/post', function(req, res) {
        var currentUser = req.session.user,
            post = new Post(currentUser.name, req.body.title, req.body.post);
        post.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            req.flash('success', '发布成功!');
            res.redirect('/'); //发表成功跳转到主页
        });
    });

    // 退出
    app.get('/logout', checkLogin);
    app.get('/logout', function(req, res) {
        req.session.user = null;
        req.flash('success', '登出成功!');
        res.redirect('/');
    });

    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录!');
            res.redirect('/login');
        }
        next();
    }

    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            res.redirect('back');
        }
        next();
    }
};
