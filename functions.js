var database = require('./database.js');

exports.logC = function(string){
    console.log(string);
};

exports.login = function(username, password, callback){
    database.mongoConnect(function(db){
        var users = db.collection('users');
        users.find({'username':username},{username:1, password:1, _id:0}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                console.log(data);
                if(data[0].password == password){
                    callback(data[0]); //user exists, password correct
                } else {
                    callback(null); //user exists, password wrong
                }
            } else {
                callback(); //username doesn't exist
            }
            db.close();
        })
    });
}

exports.findByName = function(username, callback){
    database.mongoConnect(function(db){
        var users = db.collection('users');
        users.find({'username':username},{username:1, _id:0}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                callback(data[0]); //user exists
            } else {
                callback(); //username doesn't exist
            }
            db.close();
        })
    });
}

exports.register = function(username, password, callback){
    database.mongoConnect(function(db){
        var users = db.collection('users');
        
        //check if username exists
        users.find({'username':username},{username:1,_id:0}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                console.log('user exists');
                console.log(data);
                db.close();
                callback();
                return;
            } else {
                //user not already in db
                users.insert({'username':username,'password':password}, function(err, data){
                    if(err) throw err;
                    var user = {
                        'username':username,
                        'password':password
                    };
                    callback(user);
                    db.close();
                });
            }
        })
    })
}

exports.fbregister = function(id, name, callback){
    database.mongoConnect(function(db){
        var users = db.collection('users');
        //check if username exists
        users.find({'fb-id':id},{'fb-id':1,'username':1,_id:0}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                console.log('user exists');
                console.log(data[0]);
                var user = {
                    'username':data[0].username
                };
                db.close();
                callback(user);
                return;
            } else {
                //user not already in db
                users.insert({'fb-id':id,'username':name}, function(err, data){
                    if(err) throw err;
                    var user = {
                        'username':name
                    };
                    callback(user);
                    db.close();
                });
            }
        })
    })
}