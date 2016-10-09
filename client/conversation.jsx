import React from 'react';
import {Modal,ModalHeader,ModalTitle,ModalClose,ModalBody,ModalFooter} from 'react-modal-bootstrap';

var Conversation = React.createClass({
  getInitialState: function(){
    return {
      isOpen:true,
      newMessage:"",
    }
  }
  , changeMessage: function(event){
    this.setState({newMessage:event.target.value})
  }
  , send: function(){
    var component = this;
    $.post("/reply",
    {
      fromID:this.props.user._id,
      message: this.state.newMessage,
      conversationID: this.props.data._id,
    }, function(){
      component.props.updateConversationModal();
    }
  );
  }
  , render: function(){
    var component = this;
    var lastSender;
    return (
      <Modal isOpen={this.state.isOpen} onRequestHide={this.props.close} id="conversation-modal">
        <ModalHeader>
          <ModalClose onClick={this.props.close}/>
          <ModalTitle>Message</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="conversation-messages">
            {this.props.data.messages.map(function(message){
              var currentUser = false;
              var newMessageGroup = false;
              if(message.from != lastSender){
                lastSender = message.from;
                newMessageGroup = true;
              }
              if(message.from === component.props.user._id){currentUser = true;}
              return (<ChatBox data={message} key={message.from + message.time} currentUser={currentUser} names={component.props.data.names} newMessageGroup={newMessageGroup}/>)
            })}
          </div>
          <input type='text'  value={this.state.newMessage} controlled={true} onChange={this.changeMessage}/>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-default' onClick={this.props.close}>
            Close
          </button>
          <button className='btn btn-primary' onClick={this.send}>
            Send
          </button>
        </ModalFooter>
      </Modal>
    )
  }
});

var ChatBox = React.createClass({
  render: function(){
    var classes = "message-bubble";
    if(this.props.currentUser){classes += " bubble-right";}
    else {classes += " bubble-left"}
    if(this.props.newMessageGroup){
      var name = this.props.names[this.props.data.from];
      var nameDisplay = (<p><strong>{name}:</strong></p>)
    }
    return (
      <div className="bubble-container">
        <div className={classes}>
          {nameDisplay}
          <p classNmae="bubble-text">{this.props.data.message}</p>
        </div>
      </div>
    )
  }
})

export default Conversation;
