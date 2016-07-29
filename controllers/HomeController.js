var functions = require('../functions.js');

exports.index = function(request, response){
    response.render('home/index', {user: request.user});
};

exports.login = function(request, response){
    response.render('home/login', {user: request.user});
};

exports.register = function(request, response){
    response.render('home/register', {user: request.user});
};

exports.newSurvey = function(request, response){
    response.render('home/newSurvey', {user: request.user});
}

exports.Survey = function(request, response){
    functions.getSurvey(request.params.id, function(data){
        if(data == null){response.redirect('/');}
        var requestedSurvey = data;
        functions.findUserByID(requestedSurvey.creator, function(creator){
            response.render('home/Survey', {survey: data, creator:creator, user: request.user});
        })
        
    });
}