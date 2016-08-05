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
        functions.findUserByID(userID, db, function(user){
            if(user){
                functions.getProfile(userID, db, function(profile){
                    if(profile){
                        response.render('home/profile', {user: user, profile: profile})
                    }
                });
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