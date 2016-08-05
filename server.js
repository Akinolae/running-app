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
    defaultLayout: 'main'
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
  delete req.session.success;
  if (success) res.locals.success = success;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));


require('./router')(app);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  functions.findByName(username, function(user){
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
      if(user){
        req.session.success = 'You are successfully logged in ' + user.username + '!';
        done(null,user);
      } else {
        done(null);
      }
    })
  }
));
passport.use(new FacebookStrategy({
    clientID: '778573108946412',
    clientSecret: '49ff49a5c7a606111aacf179ddfb3389',
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
