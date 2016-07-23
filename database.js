var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoUrl = process.env.MONGOLAB_URI;

exports.mongoConnect = function(callback){
    MongoClient.connect(mongoUrl, function (err, database) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', mongoUrl);
        callback(database);
      }
});
}