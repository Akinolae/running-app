var functions = require('../functions.js');
var database = require('../database.js');

exports.index = function(request, response){
    response.render('home/index', {user: request.user});
};

exports.login = function(request, response){
    response.render('home/login', {user: request.user});
};

exports.register = function(request, response){
    response.render('home/register', {user: request.user});
};

exports.editProfile = function(request, response){
    var userID = request.user._id.toString();
    database.mongoConnect(function(db){
        functions.findUser(userID, function(user){
            response.render('home/editProfile', {user: user})
        });
    });
};

exports.profile = function(request, response){
    var userID = request.params.userID;
    database.mongoConnect(function(db){
        functions.findUser(userID, function(user){
            if(user){
                response.render('home/profile', {user: user})
            }
        });
    });
}

exports.listUsers = function(request, response){
    if(request.user){
        var userID = request.user._id.toString();
        var user;
        functions.findUser(userID, function(profile){
            user = profile;
            functions.getAllUsers(function(userArray){
                userArray = functions.getSeparationArray(user, userArray)
                response.render('home/listUsers.handlebars', {user:user, infoArray: userArray})
            });
        });
    } else {
        request.session.failure = 'Please log in to view other users';
        response.redirect('back');
    }
}

exports.sendMessage = function(request, response){
    if(!request.user){
        request.session.failure = "You must be logged in to send a message";
        response.redirect('/');
    }
    if (request.params.userID){
        functions.findUser(request.params.userID.toString(), function(to){
            response.render('home/sendMessage', {from:request.user, to:to})
        })
    } else {
        request.session.failure = 'No recipient ID';
        response.redirect('back');
    }
}