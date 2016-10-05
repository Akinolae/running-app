import React from 'react';

var Navbar = React.createClass({
  getInitialState: function(){
  },
  render: function(){
    var username = "";
    if(this.props.user){username = this.props.user.username;}
    return (
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>

          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapse-menu" aria-expanded="true">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#">Running Meetup</a>

          </div>

          <div className='collapse navbar-collapse pull-right' id='collapse-menu'>
            <ul className='navbar nav'>
              <li><a href="/">Home ({username})</a></li>
              <li><a href="/messages">Messages</a></li>
              <li><a href="/editProfile">Edit Profile</a></li>
              <li><a href="/listUsers">Show Nearby Runners</a></li>
              <li><a  href="/profile/"></a></li>
              <li><a  href="/logout">Log Out</a></li>
            </ul>
          </div>
        </div>
      </nav>

    )
  }
});

export default Navbar;
