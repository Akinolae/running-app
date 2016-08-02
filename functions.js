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
            db.close();
        })
    });
}
exports.findByName = findByName;

function findUserByID(id, callback){//returns only name and id
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
exports.findUserByID = findUserByID;

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

function editProfile(userID, pace, distance, lat, lon, callback){
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
exports.editProfile = editProfile;

function getProfile(userID, callback){
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
        })
    })
}
exports.getProfile = getProfile;

exports.getAllUserIDs = function(callback){
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
            db.close();
        });
    });
};

exports.getNamesAndProfiles = function(IDArray, callback){
    var infoArray = [];
    for(var i = 0; i < IDArray.length; i++){
        findUserByID(IDArray[i], function(user){
            getProfile(user._id, function(profile){
                infoArray.push({'userID':user._id, 'name':user.username, 'profile':profile});
                if(infoArray.length == IDArray.length){
                    callback(infoArray);
                }
            })
        })
    }
}

function getSeparation(p1, p2){//returns separation in miles
    var lat1 = p1.profile.lat;
    var lon1 = p1.profile.lon;
    var lat2 = p2.profile.lat;
    var lon2 = p2.profile.lon;
    return getDistance(lat1,lon1,lat2,lon2);
}

function getDistance(lat1, lon1, lat2, lon2){
    return Math.sqrt((lat1 - lat2)^2 + (lon1 - lon2)^2) * 69;
}
