const exitChat = document.getElementById('exit-chat');
const sendMessage = document.getElementById('send-message');
const chatsCanStored = 10;
let showUsers = document.getElementById('showUsers');
const boxName = document.getElementById('boxName');
const addGroup = document.getElementById('addGroup');

exitChat.onclick = () => {
    window.location.href = '../views/login.html';
}

sendMessage.addEventListener('click', postMessage);

async function postMessage(e) {
    try {
    e.preventDefault();

    let message = document.getElementById('message-input');

    const textMessage = message.value
    const groupdata = JSON.parse(localStorage.getItem('groupDetails'));
    const groupId = groupdata.id
    
    const messageObj = {
        textMessage,
        groupId
    }

    const token = localStorage.getItem('token');

    const response = await axios.post('http://localhost:3000/chat-app/send-message', messageObj, { headers: {"Authorization": token }});
    showUsersChatsOnScreen(response.data.textMessage);

    let usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
    usersChats.push(response.data.textMessage)
    let chats = usersChats.slice(usersChats.length - chatsCanStored);
    localStorage.setItem('usersChats', JSON.stringify(chats));

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
    const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));

    if(oldMsgs.length > 0) {
        lastMsgId = oldMsgs[oldMsgs.length-1].id;
    }

    oldMsgs.forEach(chats => {
        if(groupDetails.id === chats.groupId) {
            showUsersChatsOnScreen(chats)
        }
    })

    showGroupName(groupDetails.groupName)
    getGroups();
    showUserName();

    // setInterval(() => {
        getUserMsgs(lastMsgId);
        document.getElementById('newMessages').textContent = ' ';
    // },1000)
    
    } catch(err) {
        console.log(err);
    }
})

const getUserMsgs = async (lastMsgId) => {
    try {
        const groupData = JSON.parse(localStorage.getItem('groupDetails'));
        const grouId = groupData.id
        const response = await axios.get(`http://localhost:3000/chat-app/get-Message?lastMsgId=${lastMsgId}&groupId=${grouId}`,);
        let userChats = response.data.latestChats; 
        console.log(userChats);
        if(userChats === 'no messages') {
            userChats = {
                message: 'Enter some message to start conversation',
                sender: 'Chat App'
            }
            showUsersChatsOnScreen(userChats)
        }
        // else {
        //     userChats.forEach(chats => {
        //         showUsersChatsOnScreen(chats)
        //     })
        // }
        // let usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
        // usersChats = userChats
        // let chats = usersChats.slice(usersChats.length - chatsCanStored);
        // localStorage.setItem('usersChats', JSON.stringify(chats));
    
    } catch(err) {
        console.log(err);
    }
}

function showUsersChatsOnScreen(chats) {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    
    const ul = document.getElementById('userMessage');
    ul.style.textAlign = 'center';

    const li = document.createElement('li');
    li.className = 'sent';
    const p = document.createElement('p');
    li.append(p)

    p.textContent = `${chats.sender} : ${chats.message}`;

    if(chats.sender === decodeToken.name) {
        p.textContent = `You : ${chats.message}`
    }

    ul.append(li);
}

addGroup.addEventListener('click', () => {
    window.location.href = '../views/createGroup.html'
})

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const getGroups = async() => {
    try {

    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:3000/user-groups/get-groups', { headers: {"Authorization": token }});
    console.log(res);
    const listGroups = res.data.listOfGroups;
    const listUsers = res.data.listOfUsers;
    listGroups.forEach(groups => {
        showGroupsOnScreen(groups)
    })
    showUsers.addEventListener('click', () => {
        document.getElementById('userLists').hidden = false;
        listUsers.forEach(users => {
            showUsersOnScreen(users)
        })
    });
    } catch(err) {
        console.log(err);
    }
}

const showGroupsOnScreen = (groups) => {
    const groupLists = document.getElementById('groupLists');

    const li = document.createElement('li');
    li.className = 'contact';

    const div = document.createElement('div');
    div.className = 'wrap';
    li.append(div);

    const p = document.createElement('p');
    p.textContent = groups.groupName;
    p.id = groups.id;

    div.append(p)
    groupLists.append(li)
}

const showUsersOnScreen = (users) => {
    const userLists = document.getElementById('userLists');

    const li = document.createElement('li');
    li.className = 'contact';

    const div = document.createElement('div');
    div.className = 'wrap';
    li.append(div);

    const p = document.createElement('p');
    p.textContent = users.name;

    div.append(p)
    userLists.append(li)
}

const showGroupName = (groupName) => {
    boxName.textContent = `${groupName}`;
}

const showUserName = () => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    const userName = document.getElementById('userName');
    userName.textContent = `${decodeToken.name} Groups Lists`
}