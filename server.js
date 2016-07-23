var express = require('express');
var bodyParser = require('body-parser');
var handlebars  = require('express-handlebars'), hbs;
var app = express();
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

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
app.use(express.static(path.join(__dirname, 'static')));

// send app to router
require('./router')(app);

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
  function(username, password, done) {
    functions.addUser(username, password,function(success){
      if(success){
        console.log('logged in');
        return done(null,'user');
      } else {
        return done(null);
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
