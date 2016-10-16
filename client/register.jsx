import React from 'react';

var Register = React.createClass({
  getInitialState: function(){
    return {};
  },
  render : function(){
    return (
      <div>
        <link rel="stylesheet" href="/css/bootstrap.css"/>
        <form action="/register" method="post">
            <div className='form-inline'>
                <label>New Username:</label>
                <input type="text"  className='form-control' name="username"/>
            </div>
            <div className='form-inline'>
                <label>New Password:</label>
                <input type="password" className='form-control' name="password"/>
            </div>
            <div>
                <input type="submit" className='btn btn-success' value="Register"/>
            </div>
        </form>
      </div>
    )
  }
})

export default Register;
