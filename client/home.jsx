import React from 'react';

var Home = React.createClass({
  getInitialState: function(){
    return {};
  },
  render: function(){
    var user = this.props.user;
    var profile;
    if(user){
      profile =
        <div>
          <h2>Home page for {user.username}</h2>
          <p>Preferred distance: {user.profile.distance} miles</p>
          <p>Preferred pace: {user.profile.pace} min/mile</p>

        </div>
    }
    return (
      <div>
        {profile}
      </div>
    );
  }
});

export default Home;
