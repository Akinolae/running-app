var HomeController = require('./controllers/HomeController')
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;
var functions = require('./functions.js');

// Routes
module.exports = function(app){

    app.get('/', HomeController.index);

    app.get('/getUser', HomeController.getUser);

    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    //     /auth/facebook/callback
    app.get('/auth/facebook', passport.authenticate('facebook'));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {successRedirect: '/createProfile',
                                  failureRedirect: '/'})
        );


    app.get('/login',HomeController.login);

    app.post('/login',
      passport.authenticate('local-login', {successRedirect: '/', failureRedirect: '/login', session:true})
    );

    app.get('/register',HomeController.register);

    app.post('/register',
        passport.authenticate('local-register', {successRedirect: '/',
            failureRedirect: '/', session:true})
    );

    app.get('/logout', HomeController.logout);

    app.get('/editProfile', HomeController.editProfile);

    app.get('/updateUserData', HomeController.updateSessionUser);

    app.get('/createProfile', HomeController.editProfile);

    app.post('/editProfile', function(request, response){
        functions.editProfile(request.body.userID, request.body.pace, request.body.distance,
        request.body.lat, request.body.lon, function(){
          response.end();
        })
    })

    app.get('/profile/:userID', HomeController.profile);

    app.get('/listUsers', HomeController.listUsers);

    app.post('/listUsers', HomeController.listUsers);

    app.get('/sendMessage/:userID', HomeController.getMessageForm);

    app.post('/sendMessage', HomeController.sendMessage);

    app.get('/inbox', HomeController.inbox);

    app.get('/messages', HomeController.messages);

    app.get('/conversations/:conversationID', HomeController.conversation);

    app.post('/getConversation', HomeController.getConversation);

    app.post('/reply', HomeController.reply);

};
