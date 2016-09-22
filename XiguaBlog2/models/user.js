var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.sex = user.sex;
    this.password = user.password;
    this.email = user.email;
    this.note = user.note;
};

module.exports = User;

//存储用户信息
User.prototype.save = function (callback) {
    //要存入数据库的用户文档
    var user = {
        name: this.name,
        sex: this.sex,
        password: this.password,
        email: this.email,
        note: this.note
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //将用户数据插入 users 集合
            collection.insert(user, { safe: true }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
User.get = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        //读取 users 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, user) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, user);//成功！返回查询的用户信息
            });
        });
    });
};

User.look = function(name, callback){
    // 打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err); //错误
        }

        // 读取所有的Users
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err); // 错误
            }

            // 查找所有的用户
            collection.find().sort({name: 1}).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    callback(err); // 错误
                }
                callback(null, docs);
            });
        })
    });
};

User.lookMan = function(name, callback){
    // 打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err); //错误
        }

        // 读取所有的Users
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err); // 错误
            }

            // 查找所有的用户
            collection.find({'sex': '男'}).sort({name: 1}).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    callback(err); // 错误
                }
                callback(null, docs);
            });
        })
    });
};