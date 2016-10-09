var functions = require('../functions.js');
var database = require('../database.js');

exports.index = function(request, response){
  if(!request.user){
    console.log('no user');
    response.render('mainHTML')
  } else {
    console.log('logged in as ', request.user.username);
    request.session.user = request.user;
    console.log('session data ',request.session);
    response.render('mainHTML', {user: JSON.stringify(request.session.user)});
  }
};

exports.getUser = function(request, response){
  response.json({user:request.session.user});
}

exports.updateSessionUser = function(request, response){
  var userID = request.session.user._id;
  functions.findUser(userID, function(data){
    request.session.user = data;
    response.json({user: request.session.user});
  })
}

exports.login = function(request, response){
  console.log("login",request)
  passport.authenticate('local-login', {successRedirect: '/listUsers',
  failureRedirect: '/login', session:true})
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
    var userID = request.session.user.userID.toString();
    functions.findUser(userID, function(foundUser){
        response.json('home/profile', {user: request.user, profileOf: foundUser})
    });
}

exports.listUsers = function(request, response){
    if(!request.session.user){
        request.session.failure = "You must be logged in to view other users";
        response.end();
    }
    var userID = request.session.user._id.toString();
    var user;
    functions.findUser(userID, function(profile){
        user = profile;
        functions.getAllUsers(function(userArray){
            userArray = functions.getSeparationArray(user, userArray);
            userArray = functions.getDirectionArray(user, userArray);

            userArray=functions.filterUsers(user, userArray, request.body.filterSeparation, request.body.filterPace, request.body.filterDistance)

            response.json({userArray:userArray})
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
        subject = request.body.subject,
        message = request.body.message;

    //create new conversations
    var userArray = [fromID, toID];
    var messageObject = {from: fromID, time: Date.now(), message: message};
    console.log(messageObject);
    functions.newConversation(userArray, subject, messageObject)

    request.session.success = "Message Sent";
    response.end();
}

exports.reply = function(request, response){
    var fromID = request.body.fromID,
        conversationID = request.body.conversationID,
        time = Date.now(),
        message = request.body.message;

    //create new conversations
    var messageObject = {from: fromID, time: time, message: message};

    functions.reply(conversationID, messageObject)

    request.session.success = "Message Sent";
    response.redirect('back');
}

exports.messages = function(request, response){
  console.log("getting messages");
  var user = request.session.user;
  var userID = user._id.toString();
  functions.findUserConversations(userID, function(data){
      var conversations = [];
      for(var i = 0; i < data.length; i++){
          var lastMessage = data[i].messages[data[i].messages.length - 1];
          var messages = data[i].messages;
          var isNew = false;

          if(user.newMessages && user.newMessages.indexOf(data[i]._id.toString()) > -1){
              isNew = true;
          }

          conversations.push({'_id':data[i]._id, 'subject':data[i].subject, 'names':data[i].names,'lastMessage':lastMessage.message, 'messages':messages,'lastTime':lastMessage.time, 'isNew':isNew});
      }
      conversations.sort(function(a,b){
          return b.lastTime - a.lastTime;
      })
      response.json({conversations: conversations});
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

            //remove from new messages
            functions.removeNewMessage(userID,conversationID, function(){
                //render conversation
                response.render('home/conversation', {user:request.user, conversation:conversation, messages:messages});
            });

        }
    })
}

exports.getConversation = function(request, response){
    var conversationID = request.body.conversationID;
    var userID = request.session.user._id.toString();
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

            //remove from new messages
            functions.removeNewMessage(userID,conversationID, function(){
                //render conversation
                response.json({conversation:conversation});
            });

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

exports.logout = function(request, response){
    request.logout();
    response.redirect('/');
}
