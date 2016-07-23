exports.index = function(request, response){
    //response.pageInfo.title = 'Hello World';
    response.render('home/index', response.pageInfo);
};

exports.login = function(request, response){
    //response.pageInfo.title = 'Hello World';
    response.render('home/login', response.pageInfo);
};
 