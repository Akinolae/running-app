var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var handlebars  = require('express-handlebars'), hbs;
var app = express();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;

hbs = handlebars.create({
    defaultLayout: 'Main'
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
    console.log('authorizing');
    console.log(username);
    console.log(password);
    return done(null,'user');
    //User.findOne({ username: username }, function (err, user) {
    //   if (err) { return done(err); }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);
    // });
  }
));
passport.use(new FacebookStrategy({
    clientID: '1119006258173108',
    clientSecret: '19bb8fb576b7e39b559ab6d1b4bae098',
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null,'user');
  }
));

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Express server listening on port ' + process.env.PORT);
});
