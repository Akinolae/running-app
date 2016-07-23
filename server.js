var express = require('express');
var http = require('http');
var path = require('path');
var handlebars  = require('express-handlebars'), hbs;
var app = express();
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;
// send app to router
require('./router')(app);

hbs = handlebars.create({
    defaultLayout: 'Main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'static')));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new FacebookStrategy({
    clientID: 1119006258173108,
    clientSecret: '25e314e4d5ccc779797fd7c550852188',
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate(..., function(err, user) {
    //   if (err) { return done(err); }
    //   done(null, user);
    // });
  }
));

app.listen(process.env.PORT, process.env.IP, function(){
  console.log('Express server listening on port ' + process.env.PORT);
});
