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
        })
    });
}

function findByName(username, callback){
    database.mongoConnect(function(db){
        var users = db.collection('users');
        users.find({'username':username},{username:1, _id:1}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                callback(data[0]); //user exists
            } else {
                callback(); //username doesn't exist
            }
        })
    });
}
exports.findByName = findByName;

function findUser(id, callback){//returns only name and id
    id = new ObjectID(String(id));
    database.mongoConnect(function(db){
        var users = db.collection('users');
        users.find({_id:id},{password:0}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                callback(data[0]); //user exists
            } else {
                callback(); //username doesn't exist
            }
        })
    });
}
exports.findUser = findUser;

exports.register = function(username, password, callback){
    database.mongoConnect(function(db){
        var users = db.collection('users');
        
        //check if username exists
        users.find({'username':username},{username:1,_id:0}).toArray(function(err, data){
            if(err) throw err;
            if(data.length>0){
                console.log('user exists');
                callback();
                return;
            } else {
                //user not already in db
                users.insert({'username':username,'password':password}, function(err, data){
                    if(err) throw err;
                    var user = data.ops[0];
                    callback(user);
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
                });
            }
        })
    });
};

function editProfile(userID, pace, distance, lat, lon, callback){
    userID = new ObjectID(String(userID));
    database.mongoConnect(function(db){
        var users = db.collection('users');
        users.update({_id:userID},{
            $set: {profile: {'pace':pace, 'distance':distance, 'lat':lat, 'lon':lon}}
            }, function(){
                callback();
            })
    })
}
exports.editProfile = editProfile;

exports.getAllUserIDs = function(db, callback){
    var IDArray = [];
    database.mongoConnect(function(db){
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
        });
    });
};

exports.getAllUsers = function(callback){
    database.mongoConnect(function(db){
        var users = db.collection('users')
        users.find({}, {password:0}).toArray(function(err, data){
            if(err) throw err;
            if(data.length > 0){
                callback(data);
            } else {
                callback();
            }
        });
    });
    
}

exports.getSeparationArray = function(user, userArray){//inserts separation field into profile
    var lat1 = user.profile.lat;
    var lon1 = user.profile.lon;
    for(var i = 0; i < userArray.length; i++){
        var separation = getDistance(lat1, lon1, userArray[i].profile.lat, userArray[i].profile.lon)
        userArray[i].separation = separation;
    }
    return userArray;
}

function getDistance(lat1, lon1, lat2, lon2){
    return Math.sqrt(Math.pow((lat1 - lat2),2) + Math.pow((lon1 - lon2),2)) * 69;
}

exports.addMessageToArray = function(userID, fromID, toID, fromName, toName, arrayName, message){
    var userID = new ObjectID(String(userID.toString()));
    var pushModifier = { $push: {} };
    pushModifier.$push[arrayName] = {'message':message, 'fromID':fromID, 'toID':toID, 'fromName':fromName, 'toName':toName};
    database.mongoConnect(function(db){
        var users = db.collection('users');
        users.update({_id:userID}, pushModifier, function(){
            db.close();
        });
    })
}

exports.getMessages = function(userID, arrayName, callback){
    var userID = new ObjectID(String(userID.toString()));
    database.mongoConnect(function(db){
        var users = db.collection('users');
        var returnField = {};
        returnField[arrayName] = 1;
        returnField['_id'] = 0;
        users.find({'_id':userID}, returnField).toArray(function(err, data){
            if(err) throw err;
            callback(data[0][arrayName]);
        })
    })
}