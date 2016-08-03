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
        functions.findUser(userID, db, function(profile){
            response.render('home/editProfile', {user: request.user})
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
    var userID = request.user._id.toString();
    var userProfile;
    database.mongoConnect(function(db){
        functions.getProfile(userID, db, function(profile){
            userProfile = profile;
            functions.getAllUserIDs(db, function(IDArray){
                functions.getNamesAndProfiles(IDArray, db, function(infoArray){
                    infoArray = functions.getSeparationArray(userProfile, infoArray)
                    response.render('home/listUsers.handlebars', {user:request.user, infoArray: infoArray, userProfile: userProfile})
                });
            });
        });
    });
}