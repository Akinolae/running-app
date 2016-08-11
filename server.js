var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var handlebars  = require('express-handlebars'), hbs;
var app = express();
var session = require('express-session');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;
var functions = require('./functions.js');
var mongodb = require('mongodb');
var path = require('path');
var database = require('./database.js');
var router = express.Router();

hbs = handlebars.create({
    defaultLayout: 'main',

    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'views/partials/'
        ]
    });

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(session({ secret: 'anything',
    resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Session-persisted message middleware
app.use(function(req, res, next){
  var success = req.session.success;
  var failure = req.session.failure;
  
  delete req.session.success;
  delete req.session.failure;
  
  if (success) res.locals.success = success;
  if (failure) res.locals.failure = failure;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));


require('./router')(app);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user._id);
});

passport.deserializeUser(function(_id, done) {
  functions.findUser(_id, function(user){
    console.log("deserializing " + user.username);
    done(null, user);
  })

});

passport.use('local-register', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true
},
  function(req,username, password, done) {
    functions.register(username, password,function(user){
      if(user){
        req.session.success = 'You are successfully registered and logged in ' + user.username + '!';
        done(null,user);
      } else {
        req.session.failure = 'Registration failed!';
        done(null);
      }
    })
  }
));

passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true
},
  function(req,username, password, done) {
    functions.login(username, password,function(user){
      if(!user) {
        req.session.failure = 'Incorrect username'
        return done(null, false);
      }
      if (!user.validPassword) {
        req.session.failure = 'Invalid password'
        return done(null, false);
      }
      req.session.success = 'You are successfully logged in ' + user.username + '!';
      return done(null,user);
    })
  }
));
passport.use(new FacebookStrategy({
    clientID: '778573108946412',
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(JSON.stringify(profile));
    functions.fbregister(profile.id, profile.displayName,function(user){
      if(user){
        done(null,user);
      } else {
        done(null);
      }
    })
  }
));

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Express server listening on port ' + process.env.PORT);
});
