const chatform = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName= document.getElementById('room-name');
const userList = document.getElementById('users')

const {username, room}= Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

console.log(username,room)
const socket = io();
socket.emit('joinRoom',username,room);

socket.on('message',message=>{
    console.log(message);
    outputMessage(message);
    chatMessage.scrollTop= chatMessage.scrollHeight;
})
socket.on('tost',message=>{
    console.log(message);
    tostMessage(message);
    chatMessage.scrollTop= chatMessage.scrollHeight;
})
socket.on('roomUsers',message=>{
    outputRoom(message.room);
    getUsersList(message.users);
})

chatform.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    console.log("message form client:",msg);
    socket.emit('chatmessage',msg);
    e.target.elements.msg.value= '';
    e.target.elements.msg.focus();
})
function outputMessage(msg){
    var div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
function tostMessage(msg){
    var div = document.createElement('div');
    div.classList.add('join');
    div.innerHTML=`
    <p class="text">
        ${msg.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoom(room){
roomName.innerHTML= room
}
function getUsersList(users){
userList.innerHTML=`${users.map(user=> `<li>${user.username}<li>`).join('')}`
}