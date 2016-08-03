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

function findUser(id, db, callback){//returns only name and id
    id = new ObjectID(String(id));
    var users = db.collection('users');
    users.find({_id:id},{password:0}).toArray(function(err, data){
        if(err) throw err;
        if(data.length>0){
            callback(data[0]); //user exists
        } else {
            callback(); //username doesn't exist
        }
    })
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

function getProfile(userID, db, callback){
    userID = String(userID);
    var profiles = db.collection('profiles');
    profiles.find({userID:userID},{_id:0}).toArray(function(err,data){
        if(err) throw err;
        if(data.length > 0){
            callback(data[0]);
        } else {
            callback();
        }
    })
}
exports.getProfile = getProfile;

exports.getAllUserIDs = function(db, callback){
    var IDArray = [];
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
};

exports.getNamesAndProfiles = function(IDArray, db, callback){
    var infoArray = [];
    for(var i = 0; i < IDArray.length; i++){
        findUser(IDArray[i], db, function(user){
            getProfile(user._id, db, function(profile){
                infoArray.push({'userID':user._id, 'name':user.username, 'profile':profile});
                if(infoArray.length == IDArray.length){
                    callback(infoArray);
                }
            })
        })
    }
}

exports.getSeparationArray = function(userProfile, profileArray){//inserts separation field into profile
    var lat1 = userProfile.lat;
    var lon1 = userProfile.lon;
    for(var i = 0; i < profileArray.length; i++){
        var separation = getDistance(lat1, lon1, profileArray[i].profile.lat, profileArray[i].profile.lon)
        profileArray[i].separation = separation;
    }
    return profileArray;
}

function getDistance(lat1, lon1, lat2, lon2){
    return Math.sqrt(Math.pow((lat1 - lat2),2) + Math.pow((lon1 - lon2),2)) * 69;
}
