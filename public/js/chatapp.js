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
    console.log(response);
    console.log(response.status);
    if(response.status === 201) {
        message.value = '';
    }
    
    } catch(err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async() => {
    // const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/chat-app/users-chats');
    const userChats = response.data.allUsersChats;
    userChats.forEach((chats) => {
        showUsersChatsOnScreen(chats);
    })
})

function showUsersChatsOnScreen(chats) {
    const messagesDiv = document.getElementById('userMessage');
    const usersChatsDiv = document.createElement('div');
    usersChatsDiv.className = 'message my-message';
    
    const div = document.createElement('div');
    const div1 = document.createElement('div');

    messagesDiv.append(usersChatsDiv);
    // usersChatsDiv.append(div);
    usersChatsDiv.append(div1);

    // const userDiv = document.createElement('div');
    // userDiv.className = 'name';
    // userDiv.textContent = chats.id;

    // const userChat = document.createElement('div');
    // userChat.className = 'text';
    // userChat.textContent = chats.textMessage;

    // div.append(userDiv);
    // div.append(userDiv);

    div.className = 'name';
    div.textContent = chats.id;

    div1.className = 'text';
    div1.textContent = chats.message;
}