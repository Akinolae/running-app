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
    if(!request.user){
        request.session.failure = "You must be logged in to view other users";
        response.redirect('/');
    }
    var userID = request.user._id.toString();
    var user;
    functions.findUser(userID, function(profile){
        user = profile;
        functions.getAllUsers(function(userArray){
            userArray = functions.getSeparationArray(user, userArray);
            userArray = functions.getDirectionArray(user, userArray);
            
            userArray=functions.filterUsers(user, userArray, request.body.maxSeparation, request.body.filterPace, request.body.filterDistance)
            
            response.render('home/listUsers.handlebars', {user:user, infoArray: userArray});
        });
    });
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
        toName = request.body.toName,
        time = request.body.time,
        subject = request.body.subject,
        message = request.body.message;
    
    //create new conversations
    var userArray = [fromID, toID];
    var messageObject = {from: fromID, time: Date.now(), message: message};
    functions.newConversation(userArray, subject, messageObject)
    
    request.session.success = "Message Sent";
    response.redirect('back');
}

exports.reply = function(request, response){
    var fromID = request.body.fromID,
        fromName = request.body.fromName,
        conversationID = request.body.conversationID,
        time = request.body.time,
        message = request.body.message;
    
    //create new conversations
    var messageObject = {from: fromID, time: time, message: message};
    
    functions.reply(conversationID, messageObject)
    
    request.session.success = "Message Sent";
    response.redirect('back');
}

exports.messages = function(request, response){
    var userID = request.user._id.toString();
    functions.findUserConversations(userID, function(data){
        var conversations = [];
        for(var i = 0; i < data.length; i++){
            var lastMessage = data[i].messages[data[i].messages.length - 1];
            conversations.push({'_id':data[i]._id, 'subject':data[i].subject, 'lastUser':lastMessage.from, 'lastMessage':lastMessage.message, 'lastTime':lastMessage.time});
        }
        response.render('home/messages', {user:request.user, conversations: conversations});
    });
};

exports.conversation = function(request, response){
    var conversationID = request.params.conversationID;
    var userID = request.user._id.toString();
    functions.findConversationByID(conversationID, function(conversation){
        
        if(conversation.users.indexOf(userID) < 0){
            request.session.failure = 'Conversations are only visible to participants';
            response.redirect('back');
        } else {
            
            //put names in message array
            var messages = conversation.messages;
            var names = conversation.names;
            for(var i = 0; i < messages.length; i++){
                messages[i].fromName = names[messages[i].from];
            }
            
            //render conversation
            response.render('home/conversation', {user:request.user, conversation:conversation, messages:messages});
        }
    })
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