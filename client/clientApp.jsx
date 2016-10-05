// import React from './js/react.min.js';
// import ReactDOM from 'react-dom';
import Login from './login.jsx';
import Register from './register.jsx';
import Home from './home.jsx'
import NearbyUsers from './nearbyUsers.jsx';
import Router from 'react-router'
var App = React.createClass({
  getInitialState: function(){
    var user = null;
    return {
      user:user,
    };
  },
  componentDidMount: function(){
    this.getUser();
  },
  getUser: function(){
    var component = this;
    $.ajax({url:"getUser"}).done(function(data){
      component.setState({user:data.user})
    })
  },
  getNearby: function(){

  },
  render : function(){
    var parent = this;
    var clonedChildren = React.Children.map(this.props.children, function(child){
      return React.cloneElement(child, {user: parent.state.user, getUser:parent.getUser});
    });
    var username = "";
    if(this.state.user){username = this.state.user.username;}
    return (
      <div>
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
                <li><ReactRouter.Link to="/home">Home ({username})</ReactRouter.Link></li>
                <li><ReactRouter.Link to="/nearby">Nearby Runners</ReactRouter.Link></li>
                <li><a href="/messages">Messages</a></li>
                <li><a href="/editProfile">Edit Profile</a></li>
                <li><a href="/listUsers">Show Nearby Runners</a></li>
                <li><a  href="/profile/"></a></li>
                <li><a  href="/logout">Log Out</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='container main-container'>
            <div className='alert-box'>
              <li><ReactRouter.Link to="/login">Login</ReactRouter.Link></li>
              <li><ReactRouter.Link to="/register">Register</ReactRouter.Link></li>
            </div>
            {clonedChildren}
        </div>
      </div>
    )
  }
});
var destination = document.querySelector("#app");
ReactDOM.render(
  <ReactRouter.Router>
    <ReactRouter.Route path="/" component={App}>
      <ReactRouter.Route path="login" component={Login}/>
      <ReactRouter.Route path="register" component={Register} />
      <ReactRouter.Route path="home" component={Home}/>
      <ReactRouter.Route path="nearby" component={NearbyUsers}/>
    </ReactRouter.Route>
  </ReactRouter.Router>,
  destination);
