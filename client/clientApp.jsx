// import React from './js/react.min.js';
// import ReactDOM from 'react-dom';
import Login from './main_login.jsx';
import Router from 'react-router'
var App = React.createClass({
  getInitialState: function(){
    console.log(this.props);
    var user = null;
    return {
      user:user,
    };
  },
  render : function(){
    var user = this.state.user;
    var mainDisplay;
    if(!user) {
      mainDisplay = (<Login />);
    }
    else {
      mainDisplay = (<User />);
    }
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
                </div>
            </div>
        </nav>
        <div className='container main-container'>
            <div className='alert-box'>
            </div>
            {mainDisplay}
        </div>
      </div>
    )
  }
});
var destination = document.querySelector("#app");

ReactDOM.render(<App />, destination);
