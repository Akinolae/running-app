import React from 'react';
import jQuery from 'jquery'

var Login = React.createClass({
  getInitialState: function(){
    var username = "";
    if(this.props.user){
      username = this.props.user.username;
    }
    return {
      username:username,
      password:""
    };
  },
  componentDidMount: function(){
  },
  inputName: function(event){
      this.setState({username: event.target.value});
  },
  inputPassword: function(event){
      this.setState({password: event.target.value});
  },
  login: function(){
    console.log('login function called');
    var component = this;
    $.post("/login",
      {
        username:component.state.username,
        password:component.state.password
      },
      function(data){
        component.props.getUser();
      }
    );
  },
  render : function(){
    console.log("this is jsx yo");
    return (
      <div>
            <div className='form-inline'>
                <label>Username:</label>
                <input type="text"  className='form-control' value={this.state.username} controlled={true} onChange={this.inputName} name='username'/>
            </div>
            <div className='form-inline'>
                <label>Password:</label>
                <input type="password" className='form-control' value={this.state.password} controlled={true} onChange={this.inputPassword} name='password'/>
            </div>
            <div>
                <button className='btn btn-success' onClick={this.login}>Log In</button>
            </div>
      </div>
    )
  }
})

export default Login;
