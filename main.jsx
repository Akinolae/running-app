import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';

console.log("loaded main");
var destination = document.querySelector("#app");

ReactDOM.render(<App />, destination);
