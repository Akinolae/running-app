import React from 'react'
import Login from './main_login.jsx';

var App = React.createClass({
  getInitialState: function(){
    return {};
  },
  render : function(){
    return (
      <div>
        <h1>React Class is here to stay</h1>
        <Login />
      </div>
    )
  }
})

export default App;
