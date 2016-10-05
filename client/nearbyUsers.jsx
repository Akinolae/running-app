import React from 'react';

var NearbyUsers = React.createClass({
  getInitialState: function(){
    var nearbyUsersList = [];
    return {
      nearbyUsersList: nearbyUsersList
    }
  }
  , getList: function(){
    var component = this;
    $.post('/listUsers',
      {
        filterSeparation:5,
        filterDistance:2,
        filterPace:3
      },
      function(data){
        console.log(data.userArray);
        component.setState({nearbyUsersList:data.userArray});
      }
    )
  }
  , render: function(){
    var nearbyUsersList = this.state.nearbyUsersList;
    console.log('rendering',nearbyUsersList);
    return (
      <div>
        <h1>Nearby Users</h1>
        <button className="btn btn-default" id='showFilter'>Filter</button>
        <button className="btn btn-default" id='showFilter' onClick={this.getList}>Get Nearby</button>

        <div className='row'>
          {nearbyUsersList.map(function(nearbyUser){
            return(
              <div className='col-sm-4'>
                <a>
                  <div className='user-box'>
                    <p><strong>{nearbyUser.username}</strong> <span className='glyphicon glyphicon-envelope'></span></p>
                    <p>Prefers ~{nearbyUser.profile.distance} miles at {nearbyUser.profile.pace} min/mile</p>
                    <p>Approximately {nearbyUser.separation} miles {nearbyUser.direction}</p>
                  </div>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
});

export default NearbyUsers;

// {{!--Modal--}}
// <div className="modal fade" id='filter-modal' tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
//   <div class="modal-dialog">
//     <div class="modal-content">
//         <div class="modal-header">
//           <button type="button" class="close" data-dismiss="modal">&times;</button>
//           <h4 class="modal-title">Filter Users</h4>
//         </div>
//
//         <div class="modal-body">
//
//             <form role="form" action='/listUsers' method='post'>
//             <div>
//                 <label>Show users within: </label>
//                 <div class="dropdown">
//                     <select class="form-control" name='maxSeparation'>
//                       <option value='2'>2 miles</option>
//                       <option value='5'>5 miles</option>
//                       <option value='10'>10 miles</option>
//                       <option value='15'>15 miles</option>
//                       <option value='20'>20 miles</option>
//                     </select>
//                 </div>
//             </div>
//             <div>
//                 <label>Maximum pace difference: </label>
//                 <div class="dropdown">
//                     <select class="form-control" name='filterPace'>
//                       <option value='1'>1 minute</option>
//                       <option value='2'>2 minutes</option>
//                       <option value='3'>3 minutes</option>
//                       <option value='4'>4 minutes</option>
//                       <option value='5'>5 minutes</option>
//                     </select>
//                 </div>
//             </div>
//             <div>
//                 <label>Maximum desired run distance difference: </label>
//                 <div class="dropdown">
//                     <select class="form-control" name='filterDistance'>
//                       <option value='1'>1 mile</option>
//                       <option value='2'>2 miles</option>
//                       <option value='3'>3 miles</option>
//                       <option value='4'>4 miles</option>
//                       <option value='5'>5 miles</option>
//                       <option value='6'>6 miles</option>
//                       <option value='7'>7 miles</option>
//                       <option value='8'>8 miles</option>
//                       <option value='9'>9 miles</option>
//                       <option value='10'>10 miles</option>
//                     </select>
//                 </div>
//               <button type="submit" class="btn btn-default">Filter</button>
//             </form>
//         </div>
//
//     </div>
//   </div>
// </div>

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
