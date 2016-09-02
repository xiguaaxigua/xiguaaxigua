// 引入配置文件
var settings = require('../settings'),
    Db = require('mongodb').Db, // 实例化db
    Connection = require('mongodb').Connection, // 实例化连接
Server = require('mongodb').Server;

/*
    new Db(settings.db, new Server(settings.host, settings.port), {safe: true})
*/
module.exports = new Db(settings.db, new Server(settings.host, settings.port), {safe: true});

