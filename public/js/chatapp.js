const exitChat = document.getElementById('exit-chat');
const sendMessage = document.getElementById('send-message');


exitChat.onclick = () => {
    window.location.href = '../views/login.html';
}

sendMessage.addEventListener('click', postMessage);

async function postMessage(e) {
    try {
    e.preventDefault();

    let message = document.getElementById('message-input');

    const textMessage = message.value
    
    const messageObj = {
        textMessage
    }

    // showUsersChatsOnScreen(messageObj);

    const token = localStorage.getItem('token');

    const response = await axios.post('http://localhost:3000/chat-app/send-message', messageObj, { headers: {"Authorization": token }});
    showUsersChatsOnScreen(response.data.textMessage);

    let usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
    usersChats.push(response.data.textMessage)
    localStorage.setItem('usersChats', JSON.stringify(usersChats));

    console.log(usersChats)

    console.log(response);

    if(response.status === 201) {
        message.value = '';
    }
    } catch(err) {
        console.log(err);
    }
}


window.addEventListener('DOMContentLoaded', async () => {
    try {

    let lastMsgId = -1;

    const oldMsgs = JSON.parse(localStorage.getItem('usersChats')) || [];

    if(oldMsgs.length > 0) {
        lastMsgId = oldMsgs[oldMsgs.length-1].id;
    }

    for(let i = 0; i<oldMsgs.length-1; i++) {
        showUsersChatsOnScreen(oldMsgs[i]);
    }

    // setInterval(() => {
        getUserMsgs(lastMsgId);
        // document.getElementById('sender').textContent = '';
        // document.getElementById('senderMsg').textContent = '';
    // },3000)
    
    } catch(err) {
        console.log(err);
    }
})

const getUserMsgs = async (lastMsgId) => {
    try {
        const response = await axios.get(`http://localhost:3000/chat-app/get-Message?lastMsgId=${lastMsgId}`);
        const userChats = response.data.latestChats; 
        console.log(userChats);
        if(userChats !== 'no messages') {
            userChats.forEach(Msgs => {
                showUsersChatsOnScreen(Msgs);
            })
        }
    } catch(err) {
        console.log(err);
    }
}

function showUsersChatsOnScreen(chats) {
    const messagesDiv = document.getElementById('userMessage');
    
    const userChatsDiv = document.createElement('div');
    userChatsDiv.className = 'message other-message';

    messagesDiv.append(userChatsDiv);

    const div = document.createElement('div');

    userChatsDiv.append(div);

    let userDiv = document.createElement('div');
    userDiv.className = 'name';
    userDiv.textContent = chats.sender;
    // userChat.id = 'sender'

    let userChat = document.createElement('div');
    userChat.className = 'text';
    userChat.textContent = chats.message;
    // userChat.id = 'senderMsg';

    div.append(userDiv);
    div.append(userChat);
}