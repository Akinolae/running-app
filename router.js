var HomeController = require('./controllers/HomeController')
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

// Routes
module.exports = function(app){
     
    app.get('/', HomeController.Index);
    
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
                                  failureRedirect: '/login',
                                  failureFlash: true, session:false }),
        function(req,res){
            console.log(req.body);
        }
        );
        
    app.get('/#_=_',function(req,res){
        res.sendFile(__dirname + "/login.html");
    })
    
    app.get('/login',function(req,res){
        res.sendFile(__dirname + "/login.html");
    })
    app.post('/login',
        passport.authenticate('local', {successRedirect: '/',
            failureRedirect: '/login',session:false}),
        function(req,res){
            console.log(req.body);
        }
    );
 
};
