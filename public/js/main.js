// public/js/main.js
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const roomNumber = document.getElementById('room-number');
const userList = document.getElementById('users');
const userList1 = document.getElementById('users1');
const {
    username,
    room,
    email
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
const socket = io();
let universe;
// Join chatroom
let identifier = username + room + email;
socket.emit('joinRoom', {
    username,
    room,
    email,
    identifier
});
socket.on('roomUsers', ({
    room,
    users,
    email
}) => {
    console.log(room);
    outputRoomNumber(room);
    outputRoomName(email);
    universe = email;
    outputUsers(users);
});
socket.on('pastmessages', ({
    user,
    message,
    time,
    email,
    date
}) => {
    outputpastmessage({
        user,
        message,
        time,
        email,
        date
    });
});
socket.on('allusers', ({
    email
}) => {
    var t=1;
    if(t>0){
        userList1.innerHTML = '';
        t--;
    }
    outputallusers(email);
});
function outputpastmessage(message) {
    const div = document.createElement('div');
    if (message.user == username) {
        div.classList.add('message1');
    } else {
        div.classList.add('message');
    }
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.user;
    p.innerHTML += `<span>${message.date}</span>`;
    div.appendChild(p);
    const q = document.createElement('p');
    q.classList.add('meta');
    q.innerText = 'From: ' + message.email;
    q.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(q);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.message;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
    document.getElementById('msg').scrollIntoView()
}
socket.on('message', (message) => {
    outputMessage(message);
    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Get message text
    let msg = e.target.elements.msg.value;
    msg = msg.trim();
    if (!msg) {
        return false;
    }
    // Emit message to server
    socket.emit('chatMessage', msg);
    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});
function outputMessage(message) {
    const div = document.createElement('div');
    if (message.username == username) {
        div.classList.add('message1');
    } else {
        div.classList.add('message');
    }
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.date}</span>`;
    div.appendChild(p);
    const q = document.createElement('p');
    q.classList.add('meta');
    q.innerText = 'From: ' + message.email;
    q.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(q);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
    document.getElementById('msg').scrollIntoView()
}
function outputRoomName(room) {
    roomName.innerText = room;
}
function outputRoomNumber(room) {
    roomNumber.innerText = "Room Number: " + room;
}
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}
function outputallusers(user) {
    const li = document.createElement('li');
    li.innerText = user;
    userList1.appendChild(li);
}
document.getElementById('leave-btn').addEventListener('click', () => {
    window.location = 'view_requests';
});