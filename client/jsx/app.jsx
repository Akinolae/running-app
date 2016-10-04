import Login from './main_login.jsx';

var App = React.createClass({
  getInitialState: function(){
    return {};
  },
  render : function(){
    return (
      <div>
        <h1>React Class</h1>
        <Login />
      </div>
    )
  }
})

var destination = document.querySelector("#app");

ReactDOM.render(<App />, destination);
