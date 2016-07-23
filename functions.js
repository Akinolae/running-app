var database = require('./database.js');

exports.logC = function(string){
    console.log(string);
};

exports.checkUser = function(username, password){
    var name = 'Peter';
    var pw = 'pw';
    if(username == name && password == pw){
        return true;
    } else {
        return false;
    }
}

exports.addUser = function(username, password, callback){
    database.mongoConnect(function(db){
        var users = db.collection('users');
        
        //check if username exists
        users.find({'username':username},{username:1,_id:0}).toArray(function(err, data){
            if(err) throw err;
            if(data.length > 0){
                console.log('user exists');
                console.log(data);
                db.close();
                callback(false);
                return;
            } else {
                //user not already in db
                users.insert({'username':username,'password':password}, function(err, data){
                    if(err) throw err;
                    callback(true);
                    db.close();
                });
            }
        })
    })
}