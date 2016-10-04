var App = React.createClass({
  getInitialState: function(){
    return {};
  },
  render : function(){
    return (
      <div>
        <h1>React Class</h1>
      </div>
    )
  }
})

var destination = document.querySelector("#container");

ReactDOM.render(<App />, destination);
