var mongodb = require('./db');

function User(user) {
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
}

module.exports = User;

User.prototype.save = function(){

}