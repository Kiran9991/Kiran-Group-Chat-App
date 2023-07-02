const exitChat = document.getElementById('exit-chat');
const sendMessage = document.getElementById('send-message');
const chatsCanStored = 100;
const addGroup = document.getElementById('addGroup');

exitChat.onclick = () => {
    window.location.href = '../views/login.html';
    localStorage.removeItem('groupDetails');
    localStorage.removeItem('link');
}

sendMessage.addEventListener('click', postMessage);

async function postMessage(e) {
    try {
    e.preventDefault();

    let message = document.getElementById('message-input');

    const textMessage = message.value
    const groupdata = JSON.parse(localStorage.getItem('groupDetails')) || { id:null };
    const groupId = groupdata.id
    
    const messageObj = {
        textMessage,
        groupId
    }

    const token = localStorage.getItem('token');

    const response = await axios.post('http://localhost:3000/chat-app/send-message', messageObj, { headers: {"Authorization": token }});
    showUsersNewChatOnScreen(response.data.textMessage);

    let usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
    usersChats.push(response.data.textMessage)
    let chats = usersChats.slice(usersChats.length - chatsCanStored);
    localStorage.setItem('usersChats', JSON.stringify(chats));

    if(response.status === 201) {
        message.value = '';
        window.location.reload();
    }
    } catch(err) {
        console.log(err);
    }
}


window.addEventListener('DOMContentLoaded', async () => {
    try {

    let lastMsgId = 1;

    const oldMsgs = JSON.parse(localStorage.getItem('usersChats')) || [];
    const groupDetails = JSON.parse(localStorage.getItem('groupDetails')) || { id: null, groupName: 'Chat App'}
    
    if(groupDetails.id === null) {
        document.getElementById('message-input').disabled = true;
        document.getElementById('send-message').disabled = true;
        document.getElementById('messageBox').style.textAlign = 'center';
        document.getElementById('messageBox')
        .textContent = `Please Select a Group or Create a new Group to Start Conversation`
    }

    if(oldMsgs.length > 0) {
        lastMsgId = oldMsgs[oldMsgs.length-1].id;
    }

    oldMsgs.forEach(chats => {
        if(groupDetails.id === chats.groupId) {
            showUsersOldChatsOnScreen(chats)
        }
    })

    showGroupName(groupDetails.groupName)
    getGroups();
    showUserName();

    // setInterval(() => {
        getUserMsgs(lastMsgId);
        document.getElementById('newMessages').textContent = ' ';
    // },3000)
    
    } catch(err) {
        console.log(err);
    }
})

const getUserMsgs = async (lastMsgId) => {
    try {
        const groupData = JSON.parse(localStorage.getItem('groupDetails')) || { id:-1 };
        const grouId = groupData.id
        const response = await axios.get(`http://localhost:3000/chat-app/get-Message?lastMsgId=${lastMsgId}&groupId=${grouId}`,);
        let userChats = response.data.latestChats; 
        // newUserChats.push(userChats)
        // console.log(newUserChats);
        if(userChats === 'no messages') {
            userChats = {
                message: 'Enter some message to start conversation',
                sender: 'Chat App'
            }
            showUsersNewChatOnScreen(userChats)
        }
    } catch(err) {
        console.log(err);
    }
}

function showUsersOldChatsOnScreen(chats) {
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

function showUsersNewChatOnScreen(chats) {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    
    const ul = document.getElementById('newMessages');
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
    // console.log(res);
    const listGroups = res.data.listOfGroups;
    const listUsers = res.data.listOfUsers;
    listGroups.forEach(groups => {
        showGroupsOnScreen(groups)
    })
    let showUsers = document.getElementById('showUsers');
    showUsers.addEventListener('click', () => {
        document.getElementById('userLists').hidden = false;
        listUsers.forEach(users => {
            showUsersOnScreen(users)
        })
    });
    const sendRequest = document.getElementById('sendRequest');
    sendRequest.addEventListener('click', async () => {
        document.getElementById('userLists').hidden = false;
        document.getElementById('listUserTitle').textContent = `Invite a user to your groups`
        listUsers.forEach(users => {
            showUsersOnScreen(users)
        })
    })
    const showRequest = document.getElementById('showRequests');
    showRequest.addEventListener('click', showRequests)
    } catch(err) {
        console.log(err);
    }
}

const showGroupsOnScreen = (groups) => {
    const groupLists = document.getElementById('groupLists');

    const li = document.createElement('li');
    li.className = 'contact';
    li.addEventListener('click', () => {
        console.log('current group');
        localStorage.setItem('groupDetails',JSON.stringify(groups));
        localStorage.setItem('link',`http://localhost:3000/chatApp.html/${groups.id}`)
        window.location.href = `../views/chatApp.html?groupId=${groups.id}`;
    })

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
    const button = document.createElement('input');
    button.value = 'send invite link';
    button.type = 'button';
    p.textContent = users.name;
    p.append(button)

    const groupData = JSON.parse(localStorage.getItem('groupDetails'));
    const token = localStorage.getItem('token');
    const link = `../views/chatApp.html?groupId=${groupData.id}`;
    const groupId = groupData.id;
    const toUserId = users.id;
    const obj = {
        link,
        toUserId,
        groupId
    }
    if(groupData.id) {
    button.addEventListener('click', async() => {
        const inviteLink = await axios.post(`http://localhost:3000/user-groups/send-Request`, obj,
        { headers: {"Authorization": token }})
        console.log(inviteLink.data.links);
    })
    }

    div.append(p)
    userLists.append(li)
}

const showGroupName = (groupName) => {
    const boxName = document.getElementById('boxName');
    boxName.textContent = `${groupName}`;
}

const showUserName = () => {
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);
    const userName = document.getElementById('userName');
    userName.textContent = `${decodeToken.name} Groups Lists`
}

const showRequests = async() => {
    const token = localStorage.getItem('token');
    const docodeToken = parseJwt(token);
    const id = docodeToken.userId;
    const response = await axios.get('http://localhost:3000/user-groups/get-Request',
    { headers: {"Authorization": token }})
    const data = response.data.requestLink
    console.log(data);
    data.forEach(links => {
        showLink(links)
    })
}

const showLink = (links) => {
    document.getElementById('listUserTitle').textContent = 'List of Requests link'
    const userLists = document.getElementById('userLists');
    userLists.hidden = false;

    const li = document.createElement('li');
    li.className = 'contact';

    const div = document.createElement('div');
    div.className = 'wrap';
    li.append(div);

    const p = document.createElement('p');
    const btn1 = document.createElement('button');
    btn1.innerHTML = 'accept';
    const btn2 = document.createElement('button');
    btn2.innerHTML = 'reject';
    console.log(links.inviteLink);
    p.textContent = links.sender;
    p.append(btn1);
    p.append(btn2);
    btn1.addEventListener('click', async() => {
       const groupId = links.groupId;
       const response = await axios.get(`http://localhost:3000/user-groups/get-groupRequest?groupId=${groupId}`)
       const groupData = response.data.groupDetails
       localStorage.setItem('groupDetails', JSON.stringify(groupData));
       window.location.href = links.inviteLink;
    })
    
    btn2.addEventListener('click', () => {
        div.remove();
    })

    div.append(p)
    userLists.append(li)
}