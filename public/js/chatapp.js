const exitChat = document.getElementById('exit-chat');
const sendMessage = document.getElementById('send-message');

exitChat.onclick = () => {
    window.location.href = '../views/login.html';
}

sendMessage.addEventListener('click', storeMessage);

async function storeMessage(e) {
    try {
    e.preventDefault();

    let message = document.getElementById('message-input');

    const textMessage = message.value
    
    const messageObj = {
        textMessage
    }

    // showUsersChatsOnScreen(messageObj);

    const token = localStorage.getItem('token');

    const response = await axios.post('http://localhost:3000/chat-app/user-chat', messageObj, { headers: {"Authorization": token }});
    showUsersChatsOnScreen(response.data.textMessage);
    console.log(response);
    console.log(response.status);
    if(response.status === 201) {
        message.value = '';
    }
    
    } catch(err) {
        console.log(err);
    }
}


window.addEventListener('DOMContentLoaded', async () => {
    const getUserTexts = async() => {
        try {
        const response = await axios.get('http://localhost:3000/chat-app/users-chats');
        const userChats = response.data.allUsersChats;
        userChats.forEach(Chats => {
            showUsersChatsOnScreen(Chats);
        })
        } catch(err) {
            console.log(err);
        }
    }
    setInterval(() => {
        getUserTexts();
    }, 1000)
})

function showUsersChatsOnScreen(chats) {
    const messagesDiv = document.getElementById('userMessage');
    
    const userChatsDiv = document.createElement('div');
    userChatsDiv.className = 'message other-message';

    messagesDiv.append(userChatsDiv);

    const div = document.createElement('div');

    userChatsDiv.append(div);

    const userDiv = document.createElement('div');
    userDiv.className = 'name';
    userDiv.textContent = chats.sender;

    const userChat = document.createElement('div');
    userChat.className = 'text';
    userChat.textContent = chats.message;

    div.append(userDiv);
    div.append(userChat);
}