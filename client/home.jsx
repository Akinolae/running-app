import React from 'react';

var Home = React.createClass({
  render: function(){
    var user = this.props.user;
    var profile;
    return (
        <div>
          <h2>Home page for {user.username}</h2>
          <p>Preferred distance: {user.profile.distance} miles</p>
          <p>Preferred pace: {user.profile.pace} min/mile</p>
        </div>
    );
  }
});

export default Home;
