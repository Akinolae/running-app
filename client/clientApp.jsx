// import React from './js/react.min.js';
// import ReactDOM from 'react-dom';
import Login from './login.jsx';
import Register from './register.jsx';
import Navbar from './navbar.jsx';
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
      console.log("getting serialized user",data.user);
    })
  },
  render : function(){
    var parent = this;
    var clonedChildren = React.Children.map(this.props.children, function(child){
      return React.cloneElement(child, {user: parent.state.user, getUser:parent.getUser});
    })
    return (
      <div>
        <Navbar user={this.state.user}/>
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
    </ReactRouter.Route>
  </ReactRouter.Router>,
  destination);
