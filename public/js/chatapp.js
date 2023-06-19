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