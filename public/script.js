const socket=io('/');
// console.log(socket);
// console.log(window.location.origin);
const videoGrid=document.getElementById('video-grid');
var myPeer = new Peer(undefined,{
    path:'/peerjs',
    host:'/',
    port:'443'
})
let username = sessionStorage.getItem("username");
// console.log(typeof(username));
console.log(username);
const myVideo=document.createElement('video');
myVideo.muted=true;
const peers={};
// We don't want to listen to our own video and hence muting our video
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream=>{ 
   addVideoStream(myVideo,stream);
   myVideoStream=stream;
//    to listen and send our stream
   myPeer.on('call',call=>{
    call.answer(stream);
    const video=document.createElement('video');
    // to listen for their video
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
})

   socket.on('user-connected',(userId,username)=>{
    console.log('user connected');
    setTimeout(connectToNewUser,1000,userId,stream);      
})
let text = jQuery("input");
jQuery(document).ready(function($){
    function handleCredentialResponse(googleUser){
        //         var profile = googleUser.getBasicProfile();
        //         console.log(profile);
        //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        //   console.log('Name: ' + profile.getName());
        console.log(googleUser);
            }
    jQuery('html').keydown(function (e) {
        if (e.which == 13 && text.val().length !== 0) {
          socket.emit('message', text.val());
          console.log(` This is text.val()${text.val()}`);
          text.val('')
        }
      });
})
socket.on('createMessage',(message,username)=>{
    console.log(message);
    jQuery('.messages').append(`<li class="message"><b>${username}</b><br>${message}</li>`);
    scrollToBottom();
 })
 
})
socket.on('user-disconnected',userId=>{
    if(peers[userId]) peers[userId].close();
})

// As user connect to room,we want to run this code
myPeer.on('open',id=>{
    socket.emit('join-room',ROOM_ID, id,username);
})
// socket.emit send an event to the server

//  socket.on('user-connected', function (userId) {
//          console.log('User connected:' + userId);
//      })
function connectToNewUser(userId,stream){
    // It's going to call a user with given userId and we're passing stream to the user
    const call=myPeer.call(userId,stream);
    const video=document.createElement('video');
    // call.on listen for their video stream or when they send their video stream
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close',()=>{
        video.remove();
    })
    peers[userId]=call;
}
function addVideoStream(video,stream){
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    video.classList.add('video-item');
    videoGrid.append(video);
}
const scrollToBottom=()=>{
    let d=jQuery('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}
// Mute our Video
const muteUnmute=()=>{
    let enabled=myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled=false;
        // console.log('setMuted');
        setUnmuteButton();
    }
    else{
        // console.log('setUnmuted');
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled=true;
    }
}
const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled){
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo();
    } else {
      setStopVideo();
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
const setMuteButton=()=>{
    // console.log('setMuted');
    const html=`
    <i class="fas fa-microphone"></i>
                    
    `;
    console.log(html);
    document.querySelector('.main__mute_button').innerHTML=html;
}
const setUnmuteButton=()=>{
    const html=`
    <i class="fas fa-microphone-lines-slash"></i>
                    
    `
    console.log(html);
    document.querySelector('.main__mute_button').innerHTML=html;
}
const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
     
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
 
  