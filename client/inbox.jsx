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
                  <Conversation key={conversation._id} conversationData={conversation} />
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
});

var Conversation = React.createClass({
  getInitialState: function(){
    var data = this.props.conversationData;
    var nameList = Object.keys(data.names).map(function(key){return data.names[key]});
    var lastTime = Moment(data.lastTime).fromNow();
    return {
      names:nameList,
      lastTime: lastTime
    };
  },
  render: function(){
    return (
      <tr>
        <td className='col-sm-2'><strong>{this.props.conversationData.subject}</strong></td>
        <td className='col-sm-2'>{this.state.names.join(" ")}</td>
        <td className='col-sm-6'>{this.props.conversationData.lastMessage}</td>
        <td className='time col-sm-2'>{this.state.lastTime}</td>
      </tr>
    )
  }
})

export default Inbox;
