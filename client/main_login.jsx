import React from 'react';

var Login = React.createClass({
  getInitialState: function(){
    return {};
  },
  render : function(){
    return (
      <div>
        <form action="/login" method="post">
            <div className='form-inline'>
                <label>Username:</label>
                <input type="text"  className='form-control' name="username"/>
            </div>
            <div className='form-inline'>
                <label>Password:</label>
                <input type="password" className='form-control' name="password"/>
            </div>
            <div>
                <input type="submit" className='btn btn-success' value="Log In"/>
            </div>
        </form>
      </div>
    )
  }
})

export default Login;
