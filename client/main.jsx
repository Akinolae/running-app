import React from 'react';
import jQuery from 'jquery'

var Main = React.createClass({
  render : function(){
    console.log("locals");
    console.log(this.props.user);
    return (
      <div>
          <link rel="stylesheet" href="/css/bootstrap.css"/>
          <link rel="stylesheet" href="/css/styles.css"/>
          <div id="app"></div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
          <script src="js/jquery.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.min.js"></script>
          <script src="clientApp.js" type="text/javascript"></script>
      </div>
    )
  }
})

export default Main;
