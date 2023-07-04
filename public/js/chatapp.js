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
        .textContent = `Please Create a new Group to Start Conversation`
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
        const response = await axios.get(`http://localhost:3000/chat-app/get-Message?lastMsgId=${lastMsgId}&groupId=${grouId}`,)
        let userChats = response.data
        // console.log(userChats);
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
    
    const usersGroups = res.data.groupsList
    const listUsers = res.data.listOfUsers;

    usersGroups.forEach(groups => {
        showGroupsOnScreen(groups)
    })
    let addUsers = document.getElementById('addUsers');
    addUsers.addEventListener('click', () => {
        showUserListTitle();
        listUsers.forEach(users => {
            showUsersOnScreen(users)
        })
    });
    const showGroupMembers = document.getElementById('showGroupMembers');
    showGroupMembers.addEventListener('click', async () => {
        const groupDetails = JSON.parse(localStorage.getItem('groupDetails'))
        showUserListTitle()
        document.getElementById('userListTitle').textContent = `Group Members`
        const res = await axios.get(`http://localhost:3000/user-groups/get-groupMembers?groupId=${groupDetails.id}`);
        console.log(res.data.usersDetails);
        const listOfGroupMembers = res.data.usersDetails
        listOfGroupMembers.forEach(users => {
            showGroupUsersOnScreen(users)
        })
    })
    } catch(err) {
        console.log(err);
    }
}

const showGroupsOnScreen = (groups) => {
    const groupLists = document.getElementById('groupLists');

    const li = document.createElement('li');
    li.className = 'contact';
    li.addEventListener('click', async() => {
        
        console.log('current group');
        localStorage.setItem('groupDetails',JSON.stringify(groups));
        localStorage.setItem('link',`http://localhost:3000/chatApp.html/${groups.id}`)
        // window.location.href = `../views/chatApp.html?groupId=${groups.id}`;
        window.location.reload()
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

    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);

    if(users.id !== decodeToken.userId) {
        const userLists1 = document.getElementById('userLists');

        const li = document.createElement('li');
        li.className = 'contact';
    
        const div = document.createElement('div');
        div.className = 'wrap';
        li.append(div);
    
        const p = document.createElement('p');
        p.textContent = users.name;
    
        const groupData = JSON.parse(localStorage.getItem('groupDetails'));
        if(groupData) {
            const button = document.createElement('input');
            button.value = 'Add to Your group';
            button.type = 'button';
            p.append(button)
    
            const groupId = groupData.id;
            const toUserId = users.id;
            const obj = {
                toUserId,
                groupId
            }
            if(groupData.id) {
            button.addEventListener('click', async() => {
                const addUserToGroup = await axios.post(`http://localhost:3000/user-groups/add-user-toGroup`, obj,
                { headers: {"Authorization": token }})
                console.log(addUserToGroup.data.user_group);
                const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
                if(addUserToGroup.data.user_group.userId === users.id) {
                    alert(`You successfully added ${users.name} to ${groupDetails.groupName}`)
                }
            })
            }
        }
        div.append(p)
        userLists1.append(li)
    }
}

const showGroupUsersOnScreen = (users) => {

    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);

    const userLists1 = document.getElementById('userLists');

    const li = document.createElement('li');
    li.className = 'contact';

    const div = document.createElement('div');
    div.className = 'wrap';
    li.append(div);

    const p = document.createElement('p');
    
    if(users.id === decodeToken.userId) {
        p.textContent = `You`
    }
    p.textContent = users.name;

    const groupData = JSON.parse(localStorage.getItem('groupDetails'));
    
    div.append(p)
    userLists1.append(li)
}

const showUserListTitle = () => {
    const contacts = document.getElementById('contacts')
    const userLists = document.createElement('ul');
    userLists.id = 'userLists';
    const userListsLi = document.createElement('li');
    userListsLi.className = 'contact';
    userLists.append(userListsLi);
    const userListsDiv = document.createElement('div');
    userListsDiv.className = 'wrap';
    userListsLi.append(userListsDiv);
    const userListH3 = document.createElement('h3');
    userListsDiv.append(userListH3)
    userListH3.style.fontWeight = 'bold';
    userListH3.textContent = `List of Users`;
    userListH3.id = 'userListTitle'
    const closebtn = document.createElement('button');
    userListH3.append(closebtn)
    closebtn.innerHTML = 'Close';
    contacts.append(userLists)
    closebtn.addEventListener('click', () => {
        userLists.remove();
    })
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