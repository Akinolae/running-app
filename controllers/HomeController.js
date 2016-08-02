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

exports.editProfile = function(request, response){
    var userID = request.user._id.toString();
    functions.getProfile(userID, function(profile){
        response.render('home/editProfile', {user: request.user, profile: profile})
    });
};

exports.profile = function(request, response){
    var userID = request.params.userID;
    functions.findUserByID(userID, function(user){
        if(user){
            functions.getProfile(userID, function(profile){
                if(profile){
                    response.render('home/profile', {user: user, profile: profile})
                }
            });
        }
    })
}

exports.listUsers = function(request, response){
    var userID = request.params.userID;
    var infoArray = [];
    functions.getAllUserIDs(function(IDArray){
        for(var i = 0; i < IDArray.length; i++){
            functions.findUserByID(IDArray[i], function(user){
                functions.getProfile(user._id, function(profile){
                    infoArray.push({'user':user.username, 'profile':profile});
                    console.log(infoArray);
                })
            })
        }
    });
}