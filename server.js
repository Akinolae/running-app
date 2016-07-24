var express = require('express');
var bodyParser = require('body-parser');
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

// Use connect method to connect to the Server
database.mongoConnect(function(db){
  console.log('connected');
  db.close();
})

hbs = handlebars.create({
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session({ secret: 'anything',
    resave: true,
    saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(express.static(path.join(__dirname, 'static')));

// send app to router
require('./router')(app);

// Passport session setup.
passport.serializeUser(function(user, done) {
  console.log("serializing " + user.username);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("deserializing " + obj);
  done(null, obj);
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true
},
  function(req,username, password, done) {
    functions.addUser(username, password,function(user){
      if(user){
        done(null,user);
      } else {
        done(null);
      }
    })
  }
));
passport.use(new FacebookStrategy({
    clientID: '1119006258173108',
    clientSecret: '19bb8fb576b7e39b559ab6d1b4bae098',
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    return done(null,'user');
  }
));

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Express server listening on port ' + process.env.PORT);
});
