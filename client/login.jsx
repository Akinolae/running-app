import React from 'react';

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
  login: function(event){
    event.preventDefault();
    var component = this;
    $.post("/login",
      {
        username:this.state.username,
        password:this.state.password
      },
      function(data){
        component.props.getUser();
      }
    );
  },
  render : function(){
    return (
      <div>
        <form action="/login" method="post">
            <div className='form-inline'>
                <label>Username:</label>
                <input type="text"  className='form-control' value={this.state.username} controlled={true} onChange={this.inputName}/>
            </div>
            <div className='form-inline'>
                <label>Password:</label>
                <input type="password" className='form-control' value={this.state.password} controlled={true} onChange={this.inputPassword}/>
            </div>
            <div>
                <input type="submit" className='btn btn-success' value="Log In" onClick={this.login}/>
            </div>
        </form>
      </div>
    )
  }
})

export default Login;
