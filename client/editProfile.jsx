import React from 'react';

var EditProfile = React.createClass({
  getInitialState: function(){
    var user = this.props.user;
    return {
      pace: user.profile.pace,
      distance: user.profile.distance,
      lat: user.profile.lat,
      lon: user.profile.lon
    }
  },
  submitEdit: function(event){
    event.preventDefault();
    var user = this.props.user;
    var component = this;
    console.log(this.state.pace, this.state.distance);
    $.post("/editProfile",
      {
        userID: user._id,
        pace: this.state.pace,
        distance: this.state.distance,
        lat: this.state.lat,
        lon: this.state.lon,
      }, function(){
        component.props.getUser();
      })
  },
  inputPace: function(event){
      this.setState({pace: event.target.value});
  },
  inputDistance: function(event){
      this.setState({distance: event.target.value});
  },
  inputLat: function(event){
      this.setState({lat: event.target.value});
  },
  inputLon: function(event){
      this.setState({lon: event.target.value});
  },
  getLocationFromGoogle: function(event){
    event.preventDefault();
    var component = this;
    var address = $('#addressInput').val();
    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json',
      data: {'address': address},
      dataType: 'json',
      success: function(r){
        component.setState({lat:r.results[0].geometry.location.lat, lon:r.results[0].geometry.location.lng});
      },
      error: function(e){
        console.log('error', e);
      }
    })
  },
  getLocationFromDevice: function(){
    var component = this;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(){
          component.setState({lat:position.coords.latitude, lon:position.coords.longitude});
        });
    }
  },
  render: function(){
    var user = this.props.user;
    return (
      <div>
        <h1>Edit profile for {user.username}</h1>
        <form action='editProfile' method='post'>
          <input type="hidden" name="userID" value={user._id}/>
          <div className='row'>
            <div className='col-sm-6'>
              <label>Enter typical mile pace: </label>
              <div className="dropdown">
                <select className="form-control" id="pace" value={this.state.pace} controlled={true} onChange={this.inputPace}>
                  <option value="7">7:00</option>
                  <option value="7.5">7:30</option>
                  <option value="8">8:00</option>
                  <option value="8.5">8:30</option>
                  <option value="9">9:00</option>
                  <option value="9.5">9:30</option>
                  <option value="10">10:00</option>
                  <option value="10.5">10:30</option>
                  <option value="11">11:00</option>
                  <option value="11.5">11:30</option>
                </select>
              </div>
            </div>
            <div className='col-sm-6'>
              <label>Enter typical mileage: </label>
              <select className="form-control" id="distance" value={this.state.distance} controlled={true} onChange={this.inputDistance}>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
              </select>
            </div>
          </div>

          <label>Start coordinates (exact location will not be shown to other users): </label>

          <div className='row'>
            <div className='col-sm-6'>
              <div className='input-group'>
                <input type='text' className='form-control' id='addressInput' placeholder='Get location from address...' />
                  <span className='input-group-btn'>
                    <button className='btn btn-secondary btn-default' type='button' id='getLocationFromGoogle' onClick={this.getLocationFromGoogle}>Go!</button>
                  </span>
              </div>
              <div className='col-sm-6'>
                <button className='btn btn-default input-block-level form-control' type='button' id='getLocationFromDevice' data-toggle="tooltip" title="Requires secure connection (https)" onClick={this.getLocationFromDevice}>Get Location from Device</button>
              </div>
            </div>

          </div>

          <div className='row'>
            <div className='col-sm-6'>
              <div className='input-group'>
                <span className='input-group-addon'>Latitude:</span>
                <input type='text' className='form-control' name='lat' id='lat' value={this.state.lat} controlled={true} onChange={this.inputLat}/>
                <span className='input-group-addon'>Longitude:</span>
                <input type='text' className='form-control' name='lon' id='lon' value={this.state.lon} controlled={true} onChange={this.inputLon}/>
              </div>
            </div>
          </div>
          <button className='btn btn-default input-block-level form-control' onClick={this.submitEdit}>Save</button>
        </form>
      </div>
    )
  }
})

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
    }
}
// function showPosition(position) {
// }

// document.getElementById('getLocationFromDevice').onclick = function(){
//     getLocation();
// }


export default EditProfile;
