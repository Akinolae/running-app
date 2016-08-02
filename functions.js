var database = require('./database.js');
var ObjectID = require('mongodb').ObjectID;

exports.logC = function(string){
    console.log(string);
};

exports.login = function(username, password, callback){
    database.mongoConnect(function(db){
        var users = db.collection('users');
        users.find({'username':username},{username:1, password:1, _id:1}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                if(data[0].password == password){
                var user = {
                    '_id':data[0]._id,
                    'username':data[0].username
                };
                    callback(user); //user exists, password correct
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
        users.find({'username':username},{username:1, _id:1}).toArray(function(err, data){
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

exports.findUserByID = function(id, callback){//returns only name and id
    id = new ObjectID(String(id));
    database.mongoConnect(function(db){
        var users = db.collection('users');
        users.find({_id:id},{username:1, _id:1}).toArray(function(err, data){
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
                db.close();
                callback();
                return;
            } else {
                //user not already in db
                users.insert({'username':username,'password':password}, function(err, data){
                    if(err) throw err;
                    var user = data.ops[0];
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
        users.find({'fb-id':id},{'fb-id':1,'username':1,_id:1}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                console.log('user exists');
                console.log(data[0]);
                var user = {
                    '_id':data[0]._id,
                    'username':data[0].username
                };
                db.close();
                callback(user);
                return;
            } else {
                //user not already in db
                users.insert({'fb-id':id,'username':name}, function(err, data){
                    if(err) throw err;
                    console.log(data);
                    var user = {
                        '_id':data.ops[0]._id,
                        'username':name
                    };
                    callback(user);
                    db.close();
                });
            }
        })
    });
};

exports.responsesArray = function(responseString){
    var arr = responseString.replace(/\r?\n|\r/g,'').split(';');
    for(var i = 0; i < arr.length; i++){
        arr[i] = arr[i].trim();
    }
    for(var i = 0; i < arr.length; i++){
        if(arr[i] == ''){arr.splice(i,1); i--;} //cleans array
    }
    return arr;
}


exports.createProfile = function(userID, pace, distance, lat, lon, callback){
    database.mongoConnect(function(db){
        var profiles = db.collection('profiles');
        profiles.insert({'userID':userID, 'pace':pace, 'distance':distance, 'lat':lat, 'lon':lon}, function(err,data){
            if(err) throw err;
            callback();
            db.close();
        })
    })
}

exports.editProfile = function(userID, pace, distance, lat, lon, callback){
    database.mongoConnect(function(db){
        var profiles = db.collection('profiles');
        profiles.update({userID:userID},{
            $set: {pace:pace, distance:distance, lat:lat, lon:lon}
        }, function(){
            callback();
            db.close();
        });
    })
}

exports.getProfile = function(userID, callback){
    userID = String(userID);
    database.mongoConnect(function(db){
        var profiles = db.collection('profiles');
        profiles.find({userID:userID},{_id:0}).toArray(function(err,data){
            if(err) throw err;
            if(data.length > 0){
                callback(data[0]);
            } else {
                callback();
            }
            db.close();
        }
    )
})
}

exports.getAllUserIDs = function(callback){
    var IDArray = [];
    database.mongoConnect(function(db){
        console.log('findingUserIDs');
        var users = db.collection('users')
        users.find({}, {_id:1}).toArray(function(err, data){
            if(err) throw err;
            if(data.length > 0){
                for(var i = 0; i < data.length; i ++){
                    IDArray.push(data[i]._id);
                }
                callback(IDArray);
            } else {
                callback();
            }
            db.close();
        });
    });
};
