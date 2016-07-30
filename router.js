var HomeController = require('./controllers/HomeController')
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;
var functions = require('./functions.js');

// Routes
module.exports = function(app){
     
    app.get('/', HomeController.index);
    
    // Redirect the user to Facebook for authentication.  When complete,
    // Facebook will redirect the user back to the application at
    //     /auth/facebook/callback
    app.get('/auth/facebook', passport.authenticate('facebook'));
    
    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {successRedirect: '/',
                                  failureRedirect: '/login'})
        );
      
    
    app.get('/login',HomeController.login);
    
    app.post('/login',
        passport.authenticate('local-login', {successRedirect: '/',
            failureRedirect: '/login', session:true})
    );
    
    app.get('/register',HomeController.register);
    
    app.post('/register',
        passport.authenticate('local-register', {successRedirect: '/',
            failureRedirect: '/register', session:true})
    );
    
    app.get('/newSurvey', HomeController.newSurvey);
    
    app.post('/newSurvey', function(req, res){
        var question = req.body.question;
        var responses = functions.responsesArray(req.body.responses);
        var user = req.user;
        functions.insertSurvey(user,question,responses,function(){
            res.redirect('/');
        });
    });
    
    app.get('/survey/:id', HomeController.survey);
    
    app.post('/answer/', function(req,res){
        var surveyID = req.body.surveyID;
        var userID = req.body.userID;
        var response = req.body.response;
        functions.insertResponse(surveyID,userID,response,function(){
            res.redirect('/');
        })
    });
 
};
