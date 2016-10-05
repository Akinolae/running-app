import React from 'react';
import {Modal,ModalHeader,ModalTitle,ModalClose,ModalBody,ModalFooter} from 'react-modal-bootstrap';

var NearbyUsers = React.createClass({
  getInitialState: function(){
    var nearbyUsersList = [];
    return {
      nearbyUsersList: nearbyUsersList,
      filterSeparation:5,
      filterDistance:2,
      filterPace:3,
      message:null
    }
  }
  , componentDidMount: function(){
    this.getList();
  }
  , getList: function(){
    var component = this;
    $.post('/listUsers',
      {
        filterSeparation:this.state.filterSeparation,
        filterDistance:this.state.filterDistance,
        filterPace:this.state.filterPace
      },
      function(data){
        console.log(data.userArray);
        component.setState({nearbyUsersList:data.userArray});
      }
    )
  }
  , changeSeparation: function(event){
    this.setState({filterSeparation:event.target.value}, function(){this.getList()})
  }
  , changePace: function(event){
    this.setState({filterPace:event.target.value}, function(){this.getList()})
  }
  , changeDistance: function(event){
    this.setState({filterDistance:event.target.value}, function(){this.getList()})
  }
  , getMessageForm: function(recipientID){
    var senderID = this.props.user._id;
    var message = (<Message senderID={senderID} recipientID={recipientID} closeMessage={this.closeMessage}/>)
    this.setState({message:message})
  }
  , closeMessage: function(){
    this.setState({message:null});
  }
  , render: function(){
    var nearbyUsersList = this.state.nearbyUsersList;
    var component = this;
    return (
      <div>
        {this.state.message}
        <h1>Nearby Users</h1>
        <form id="filter" className="row" action='/listUsers' method='post'>
          <div className="col-sm-4">
            <label>Show users within: </label>
            <div className="dropdown">
              <select className="form-control" value={this.state.filterSeparation} controlled={true} onChange={this.changeSeparation}>
                <option value='2'>2 miles</option>
                <option value='5'>5 miles</option>
                <option value='10'>10 miles</option>
                <option value='15'>15 miles</option>
                <option value='20'>20 miles</option>
              </select>
            </div>
          </div>
          <div className="col-sm-4">
            <label>Maximum pace difference: </label>
            <div className="dropdown">
              <select className="form-control" value={this.state.filterPace} controlled={true} onChange={this.changePace}>
                <option value='1'>1 minute</option>
                <option value='2'>2 minutes</option>
                <option value='3'>3 minutes</option>
                <option value='4'>4 minutes</option>
                <option value='5'>5 minutes</option>
              </select>
            </div>
          </div>
          <div className="col-sm-4">
            <label>Maximum desired run distance difference: </label>
            <div className="dropdown">
              <select className="form-control" value={this.state.filterDistance} controlled={true} onChange={this.changeDistance}>
                <option value='1'>1 mile</option>
                <option value='2'>2 miles</option>
                <option value='3'>3 miles</option>
                <option value='4'>4 miles</option>
                <option value='5'>5 miles</option>
                <option value='6'>6 miles</option>
                <option value='7'>7 miles</option>
                <option value='8'>8 miles</option>
                <option value='9'>9 miles</option>
                <option value='10'>10 miles</option>
              </select>
            </div>
          </div>
        </form>
        <div className='row'>
          {nearbyUsersList.map(function(nearbyUser){
            return(
              <div className='col-sm-4' key={nearbyUser.username}>
                <User user={nearbyUser} getMessageForm={component.getMessageForm}/>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
});

var User = React.createClass({
  addFriend: function(){
    var id = this.props.user._id;
  },
  message: function(){
    var id = this.props.user._id;
    this.props.getMessageForm(id);
  },
  render: function(){
    var user = this.props.user;
    return (
      <div className='user-box'>
        <p><strong>{user.username}</strong> <span className='glyphicon glyphicon-envelope' onClick={this.message}></span></p>
        <p>Prefers ~{user.profile.distance} miles at {user.profile.pace} min/mile</p>
        <p>Approximately {user.separation} miles {user.direction}</p>
      </div>
    )
  }
});

var Message = React.createClass({
  getInitialState: function(){
    console.log(this.props.senderID);
    return {
      isOpen:true,
      subject:'Running',
      message:"Let's go"
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
      <Modal isOpen={this.state.isOpen} onRequestHide={this.props.closeMessage}>
        <ModalHeader>
          <ModalClose onClick={this.props.closeMessage}/>
          <ModalTitle>Message</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <input type='text' value={this.state.subject} controlled={true} onChange={this.changeSubject}/>
          <input type='text'  value={this.state.message} controlled={true} onChange={this.changeMessage}/>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-default' onClick={this.props.closeMessage}>
            Close
          </button>
          <button className='btn btn-primary' onClick={this.send}>
            Save changes
          </button>
        </ModalFooter>
      </Modal>
    )
  }
})

export default NearbyUsers;

// <script type="text/javascript">
//     $('.user-box').click(function(){
//         $('#message-title').html('Send message to ' + this.title);
//         $('#toID').val(this.id);
//         $('#toName').val(this.title);
//         $('#time').val(Date.now());
//         $('#messageForm').get(0).setAttribute('action','/sendMessage');
//         $('.message').modal('show');
//     })
//
//     $('#showFilter').click(function(){
//         $('#filter-modal').modal('show');
//     })
// </script>
