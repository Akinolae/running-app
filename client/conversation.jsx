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
    return (
      <Modal isOpen={this.state.isOpen} onRequestHide={this.props.close}>
        <ModalHeader>
          <ModalClose onClick={this.props.close}/>
          <ModalTitle>Message</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="conversation-messages">
            {this.props.data.messages.map(function(message){
              var currentUser = false;
              if(message.from === component.props.user._id){currentUser = true;}
              return (<ChatBox data={message} key={message.from + message.time} currentUser={currentUser}/>)
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
    return (
      <div className="bubble-container">
        <div className={classes}>
          <p>{this.props.data.message}</p>
        </div>
      </div>
    )
  }
})

export default Conversation;
