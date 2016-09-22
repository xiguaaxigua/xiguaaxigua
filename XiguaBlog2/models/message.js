var mongodb = require('./db');

function Message(name, time, content){
    this.name = name;
    this.time = time;
    this.content = content;
}

module.exports = Message;

// 存储留言
Message.prototype.save = function(callback){
    // var date = new Date();
    var message = {
        name: this.name,
        time: this.time,
        content: this.content
    };

    // 打开数据库
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('messages', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.insert(message, {safe: true}, function(err){
                mongodb.close();
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

Message.get = function(name, callback){
    mongodb.open(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('messages', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.find().sort({ name: 1 }).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(err, docs);

            });
        });
    });
};