import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login.jsx';
import Register from './register.jsx';
import Home from './home.jsx'
import NearbyUsers from './nearbyUsers.jsx';
import Inbox from './inbox.jsx';
import Message from './message.jsx';
import Conversation from './conversation.jsx'
import { Router, Route, Link } from 'react-router'
var App = React.createClass({
  getInitialState: function(){
    var user = null;
    return {
      user:user,
      messageModal:null,
      conversations:[],
      conversationModal:null,
      viewedConversationIndex:-1,
      viewedConversation:null,
    };
  },
  componentDidMount: function(){
    // this.getUser();
  },
  getUser: function(){
    var component = this;
    $.ajax({url:"getUser"}).done(function(data){
      if(!data.user){return;}
      component.setState({user:data.user}, function(){
        component.getConversations();
      })
    })
  },
  getConversations: function(callback){
    var component = this;
    $.ajax({url:"messages"}).done(function(data){
      console.log(data.conversations);
      component.setState({conversations:data.conversations});
    })
  },
  getMessageForm: function(recipientID){
    var senderID = this.state.user._id;
    var message = (<Message senderID={senderID} recipientID={recipientID} closeMessage={this.closeMessage}/>)
    this.setState({messageModal:message})
  },
  closeMessage: function(){
    this.setState({message:null});
  },
  getConversationModal: function(conversationID){
    var component = this;
    this.state.conversations.forEach(function(conversation, index){
      if(conversation._id === conversationID){
        console.log(conversation);
        component.setState({viewedConversation:conversation});
      }
    })
  },
  updateConversationModal: function(){
    var conversationID = this.state.viewedConversation._id;
    var component = this;
    $.post("/getConversation",{
      conversationID:conversationID
    }, function(data){
      component.setState({viewedConversation:data.conversation})
    })
  },
  closeConversation: function(){
    this.setState({viewedConversation:null})
  },
  render : function(){
    var parent = this;
    var conversationModal;
    if(!this.state.viewedConversation){
      conversationModal = (<div></div>);
    } else {
      conversationModal = (<Conversation data={this.state.viewedConversation} close={this.closeConversation} user={this.state.user} updateConversationModal={this.updateConversationModal}/>);
    }
    var clonedChildren = React.Children.map(this.props.children, function(child){
      return React.cloneElement(child, {user: parent.state.user, getUser:parent.getUser, getMessageForm:parent.getMessageForm, closeMessage:parent.closeMessage, conversations:parent.state.conversations, getConversationModal:parent.getConversationModal});
    });
    var username = "";
    if(this.state.user){username = this.state.user.username;}
    return (
      <div>
        {this.state.messageModal}
        {conversationModal}
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
              <ul className='navbar nav'>
                <li><Link to="/home">Home ({username})</Link></li>
                <li><Link to="/nearby">Nearby Runners</Link></li>
                <li><Link to="/inbox">Messages</Link></li>
                <li><a href="/editProfile">Edit Profile</a></li>
                <li><a  href="/profile/"></a></li>
                <li><a  href="/logout">Log Out</a></li>
              </ul>
            </div>
          </div>
        </nav>
        <div className='container main-container'>
            <div className='alert-box'>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </div>
            {clonedChildren}
        </div>
      </div>
    )
  }
});
var destination = document.querySelector("#app");
ReactDOM.render(
  <Router>
    <Route path="/" component={App}>
      <Route path="login" component={Login}/>
      <Route path="register" component={Register} />
      <Route path="home" component={Home}/>
      <Route path="nearby" component={NearbyUsers}/>
      <Route path="inbox" component={Inbox}/>
    </Route>
  </Router>,
  destination);
