import React from 'react';
import Moment from 'moment';

var Inbox = React.createClass({
  getInitialState: function(){
    var conversations = [];
    if(this.props.conversations){conversations = this.props.conversations;}
    return {
      conversations: conversations
    }
  },
  render: function(){
    var conversations = this.state.conversations;
    var component = this;
    return (
      <div>
        <h1>Inbox</h1>
        <div className='row'>
          <table className='table table-hover col-sm-12 users-table'>
            <thead><tr>
              <th>Subject</th>
              <th>From</th>
              <th>Message</th>
              <th>Sent</th>
            </tr></thead>
            <tbody>
              {conversations.map(function(conversation){
                return (
                  <ConversationRow key={conversation._id} conversationData={conversation} getConversationModal={component.props.getConversationModal}/>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
});

var ConversationRow = React.createClass({
  getInitialState: function(){
    var data = this.props.conversationData;
    var nameList = Object.keys(data.names).map(function(key){return data.names[key]});
    var lastTime = Moment(data.lastTime).fromNow();
    return {
      names:nameList,
      lastTime: lastTime
    };
  },
  getModal: function(){
    this.props.getConversationModal(this.props.conversationData._id);
  },
  render: function(){
    return (
      <tr onClick={this.getModal}>
        <td className='col-sm-2'><strong>{this.props.conversationData.subject}</strong></td>
        <td className='col-sm-2'>{this.state.names.join(" ")}</td>
        <td className='col-sm-6'>{this.props.conversationData.lastMessage}</td>
        <td className='time col-sm-2'>{this.state.lastTime}</td>
      </tr>
    )
  }
})

export default Inbox;
