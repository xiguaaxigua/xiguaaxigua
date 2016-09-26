module.exports = function (app) {

    app.get('/', function(req, res){


        res.render('index', {
            title: '首页'
        })
    });

    app.get('/page', function(req, res){

        res.render('page', {
            title: 'page'
        });
    });
};