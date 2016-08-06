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
    if(!request.user){
        request.session.failure = "Must be logged in to view profile";
        response.redirect('back');
    }
    var userID = request.user._id.toString();
    console.log(request.user);
    database.mongoConnect(function(db){
        functions.findUser(userID, function(user){
            response.render('home/editProfile', {user: user})
        });
    });
};

exports.profile = function(request, response){
    var userID = request.params.userID.toString();
    functions.findUser(userID, function(foundUser){
        response.render('home/profile', {user: request.user, profileOf: foundUser})
    });
}

exports.listUsers = function(request, response){
    if(request.user){
        var userID = request.user._id.toString();
        var user;
        functions.findUser(userID, function(profile){
            user = profile;
            functions.getAllUsers(function(userArray){
                userArray = functions.getSeparationArray(user, userArray);
                userArray = functions.getDirectionArray(user, userArray);
                response.render('home/listUsers.handlebars', {user:user, infoArray: userArray});
            });
        });
    } else {
        request.session.failure = 'Please log in to view other users';
        response.redirect('/');
    }
}

exports.getMessageForm = function(request, response){
    if(!request.user){
        request.session.failure = "You must be logged in to send a message";
        response.redirect('/');
    }
    if (request.params.userID){
        functions.findUser(request.params.userID.toString(), function(to){
            response.render('home/sendMessage', {user: request.user, from:request.user, to:to})
        })
    } else {
        request.session.failure = 'No recipient ID';
        response.redirect('back');
    }
};

exports.sendMessage = function(request, response){
    var fromID = request.body.fromID,
        toID = request.body.toID,
        fromName = request.body.fromName,
        toName = request.body.toName;
        
    var message = request.body.message;
    
    //add to recipient's array
    functions.addMessageToArray(toID, fromID, toID, fromName, toName, 'newMessages', message)
    
    //add to senders sent box
    functions.addMessageToArray(fromID, fromID, toID, fromName, toName, 'sentMessages', message)
    
    request.session.success = "Message Sent";
    response.redirect('back');
}

exports.inbox = function(request, response){
    if(!request.user){
        request.session.failure = "Must be logged in to view inbox";
        response.redirect('/');
    }
    var userID = request.user._id;
    functions.getMessages(userID, 'newMessages', function(data){
        var messageArray = data;
        response.render('home/inbox', {user: request.user, newMessages : messageArray})
    })
}