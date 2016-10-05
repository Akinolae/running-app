import React from 'react';
import {Modal,ModalHeader,ModalTitle,ModalClose,ModalBody,ModalFooter} from 'react-modal-bootstrap';

var Conversation = React.createClass({
  getInitialState: function(){
    return {
      isOpen:true,
    }
  }
  , changeSubject: function(event){
    this.setState({subject:event.target.value})
  }
  , changeMessage: function(event){
    this.setState({message:event.target.value})
  }
  , send: function(){
    var component = this;
    $.post("/sendMessage",
    {
      fromID:this.props.senderID,
      toID: this.props.recipientID,
      subject: this.state.subject,
      message: this.state.message
    }, function(){
      component.props.closeMessage();
    }
  );
  }
  , render: function(){
    return (
      <Modal isOpen={this.state.isOpen} onRequestHide={this.props.close}>
        <ModalHeader>
          <ModalClose onClick={this.props.close}/>
          <ModalTitle>Message</ModalTitle>
        </ModalHeader>
        <ModalBody>

          <input type='text'  value={this.state.message} controlled={true} onChange={this.changeMessage}/>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-default' onClick={this.props.close}>
            Close
          </button>
          <button className='btn btn-primary' onClick={this.send}>
            Save changes
          </button>
        </ModalFooter>
      </Modal>
    )
  }
});

export default Conversation;
