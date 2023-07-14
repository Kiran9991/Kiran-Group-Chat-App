const socket=io('http://localhost:3000')

const exitChat = document.getElementById('exit-chat');
const sendMessage = document.getElementById('send-message');
const chatsCanStored = 1000;
const addGroup = document.getElementById('addGroup');
const searchUsers = document.getElementById('searchContacts');
const sendMedia = document.getElementById('send-media');
const message = document.getElementById('message-input');

sendMessage.addEventListener('click', () => {
    if(message.value !== '') {
        postMessage();
    }else {
        alert(`Can't send empty message`);
    }
});

async function postMessage() {
    try {

    const textMessage = message.value
    const groupdata = JSON.parse(localStorage.getItem('groupDetails')) || { id:null };
    const groupId = groupdata.id;
    
    const messageObj = {
        textMessage,
        groupId,
    }

    const token = localStorage.getItem('token');

    const response = await axios.post('http://localhost:3000/chat-app/send-message', 
    messageObj, { headers: {"Authorization": token }});
    console.log(response.data.textMessage);
    
    showUsersChatsOnScreen(response.data.textMessage);
   
    socket.emit('send-message', response.data.textMessage);

    // let usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
    // usersChats.push(response.data.textMessage)
    // let chats = usersChats.slice(usersChats.length - chatsCanStored);
    // localStorage.setItem('usersChats', JSON.stringify(chats));

    if(response.status === 201) {
        message.value = '';
        sendMedia.value = '';
    }
    } catch(err) {
        console.log(err);
    }
}

sendMedia.addEventListener('input', uploadFile)

async function uploadFile(e) {
    try {
        const token = localStorage.getItem('token');
        const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
        const groupId = groupDetails.id;
        const file = e.target.files[0];
        const form = new FormData();
        form.append('userFile', file);
        
        const response = await axios.post(`http://localhost:3000/files/send-file?groupId=${Number(groupId)}`, form,
        {headers:{'Authorization':token ,'Content-Type': 'multipart/form-data'}})
        
        const fileData = response.data.files;
        showUsersChatsOnScreen(response.data.files)
        socket.emit('send-message', response.data.files);
        console.log(fileData);
    } catch(err) {
        console.log(err);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    try {

    let lastMsgId = -1;

    const oldMsgs = JSON.parse(localStorage.getItem('usersChats')) || [];
    const groupDetails = JSON.parse(localStorage.getItem('groupDetails')) || { id: null, groupName: 'Chat App'}
    const groupId = groupDetails.id;
    socket.emit('joined-group', groupId)
    
    if(groupDetails.id === null) {
        document.getElementById('message-input').disabled = true;
        document.getElementById('send-message').disabled = true;
        document.getElementById('showError').style.textAlign = 'center';
        const textNode = document.createTextNode(`Please Create a New Group to Start Conversation`)
        document.getElementById('showError').append(textNode)
    }

    oldMsgs.forEach(chats => {
        if(groupDetails.id === chats.groupId) {
            showUsersChatsOnScreen(chats)
        }
    })

    socket.on('received-message', messages => {
        console.log(messages);
        showUsersChatsOnScreen(messages)
    })

    showGroupName(groupDetails.groupName)
    getGroups();
    showUserName();
    getUserMsgs(lastMsgId);
    } catch(err) {
        console.log(err);
    }
})

const getUserMsgs = async (lastMsgId) => {
    try {
        const groupData = JSON.parse(localStorage.getItem('groupDetails')) || { id:-1 };
        const response = await axios.get(`http://localhost:3000/chat-app/get-Message?lastMsgId=${lastMsgId}`,)
        let lastestChats = response.data.textMessages
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

    if(isValidURL(chats.message)) {
        p.innerHTML = `<img src="${chats.message}" alt="${chats.sender}">`
    }else {
        p.textContent = `${chats.sender} : ${chats.message}`;
    }

    if(chats.userId === decodeToken.userId) {
        if(isValidURL(chats.message)) {
            p.innerHTML = `<img src="${chats.message}" alt="${chats.sender}">`
        }else {
            p.textContent = `you : ${chats.message}`;
        }
    }

    let usersChats = JSON.parse(localStorage.getItem('usersChats')) || [];
    usersChats.push(chats)
    let Chats = usersChats.slice(usersChats.length - chatsCanStored);
    localStorage.setItem('usersChats', JSON.stringify(Chats));

    ul.append(li);
}

const showNotificationOnScreen = (name) => {
    const ul = document.getElementById('newMessages');
    ul.style.textAlign = 'center';

    const p = document.createElement('p');
    p.style.fontFamily = 'bold'
    p.textContent = `${name} is connected`;

    ul.append(p);
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
    // console.log(res.data);
    const usersGroups = res.data.groupsList
    const listUsers = res.data.listOfUsers;
    const user_group = res.data.user_group

    const showGroups = document.getElementById('showMyGroups');
    showGroups.addEventListener('click', () => {
        showGroupsListTitle();
        for(let i=0, j=0; i<usersGroups.length, j<user_group.length; i++,j++) {
            showGroupsOnScreen(usersGroups[i], user_group[j])
        }
    })

    let addUsers = document.getElementById('addUsers');
    addUsers.addEventListener('click', () => {
        showUserListTitle();
        listUsers.forEach(users => {
            showUsersOnScreen(users)
        })
    });
    if(usersGroups.length > 0) {
    const showGroupMembers = document.getElementById('showGroupMembers');
    showGroupMembers.addEventListener('click', async () => {
        const groupDetails = JSON.parse(localStorage.getItem('groupDetails'))
        showGroupUserListTitle()
        const res = await axios.get(`http://localhost:3000/user-groups/get-groupMembers?groupId=${groupDetails.id}`);
        // console.log(res.data.user_group);
        const listOfGroupMembers = res.data.usersDetails
        const user_groupDetails = res.data.user_group; 
        for(let i=0, j=0; i<listOfGroupMembers.length, j<user_groupDetails.length; i++,j++) {
            showGroupUsersOnScreen(listOfGroupMembers[i], user_groupDetails[j])
        }
    })
    }
    } catch(err) {
        console.log(err);
    }
}

const showGroupsOnScreen = (groups, user_group) => {
    const groupLists = document.getElementById('groupLists');
    // const groupDetails = JSON.parse(localStorage.getItem('groupDetails')) || { id: null, groupName: 'Chat App'}

    const li = document.createElement('li');
    li.className = 'contact';
    
    li.addEventListener('click', async() => {
        // const oldMsgs = JSON.parse(localStorage.getItem('usersChats')) || [];
        localStorage.setItem('groupDetails',JSON.stringify(groups));
        // window.location.href = `../views/chatApp.html?groupId=${groups.id}`
        window.location.reload();
        // console.log(groups.groupName);
        // showGroupName(groups.groupName);
        localStorage.setItem('isAdmin', JSON.stringify(user_group.isAdmin)); 

        // if(flag) {
        //     document.getElementById('message-input').disabled = false;
        //     document.getElementById('send-message').disabled = false;
        //     document.getElementById('showError').remove();
        //     flag = false;
        // }

        // oldMsgs.forEach(chats => {
        //     if(groupDetails.id === chats.groupId) {
        //         console.log(chats.groupId);
        //         showUsersChatsOnScreen(chats)
        //     }
        // })
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
    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    const decodeToken = parseJwt(token);

    if(users.id !== decodeToken.userId) {
        const userLists1 = document.getElementById('userLists');//userLists

        const li = document.createElement('li');
        li.className = 'contact';
    
        const div = document.createElement('div');
        div.className = 'wrap';
        li.append(div);
    
        const p = document.createElement('p');
        p.textContent = users.name;

        // document.getElementById('search').hidden = false;
    
        const groupData = JSON.parse(localStorage.getItem('groupDetails'));
        if(groupData) {
            if(isAdmin) {
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
                try {
                    const addUserToGroup = await axios.post(`http://localhost:3000/user-groups/add-user-toGroup`, obj,
                    { headers: {"Authorization": token }})
                    console.log(addUserToGroup.data.user_group);
                    const groupDetails = JSON.parse(localStorage.getItem('groupDetails'));
                    if(addUserToGroup.data.user_group.userId === users.id) {
                        alert(`You successfully added ${users.name} to ${groupDetails.groupName}`)
                    }
                } catch(err) {
                    console.log(err);
                    alert(`${users.name} is already in your Group`)
                }
            })
            }
        }
        }
        div.append(p)
        userLists1.append(li)
    }
}

const showGroupUsersOnScreen = (users, user_group) => {
    const groupDetails = JSON.parse(localStorage.getItem('groupDetails'))
    const token = localStorage.getItem('token');
    const decodeToken = parseJwt(token);

    const userLists1 = document.getElementById('userLists');

    const li = document.createElement('li');
    li.className = 'contact';

    const div = document.createElement('div');
    div.className = 'wrap';
    li.append(div);

    const p = document.createElement('p');
    p.textContent = users.name;

    const isAdmin = JSON.parse(localStorage.getItem('isAdmin'));
    const removeUser = document.createElement('button');
    const makeAdmin = document.createElement('button');
    const leaveGroup = document.createElement('button')

    if(user_group.isAdmin) {
        p.textContent = users.name + ' Group Admin'
        p.style.color = 'black';
    }

    if(users.id === decodeToken.userId) {
        leaveGroup.innerHTML = `Leave`;
        p.append(leaveGroup)
        const user_groupId = user_group.id;
        leaveUserGroup(leaveGroup, user_groupId, li);
    }

    if(isAdmin) {

    removeUser.innerHTML = `remove`;
    makeAdmin.innerHTML = `Make Admin`
    p.append(removeUser)
    p.append(makeAdmin)

    if(users.id === decodeToken.userId) {
        removeUser.remove()
        makeAdmin.remove()
    }

    if(user_group.isAdmin) {
        removeUser.remove()
        makeAdmin.remove()
    }
        
    removeUser.addEventListener('click', async() => {
        const user_groupId = user_group.id;
        const res = await axios.delete(`http://localhost:3000/user-groups/delete-user?user_groupId=${user_groupId}`); 
        if(res.status === 200) {
            li.remove();
            alert(`You Successfully removed ${users.name} from ${groupDetails.groupName}`)
        }
    })

    makeAdmin.addEventListener('click', async() => {
        const user_group_Id = user_group.id;
        const res = await axios.post(`http://localhost:3000/user-groups/make-admin?user_group_Id=${user_group_Id}`); 
        if(res.status === 202) {
            makeAdmin.remove();
            removeUser.remove();
            alert(`You Successfully Made ${users.name} Admin of ${groupDetails.groupName}`)
        }
    })
    }
    
    div.append(p)
    userLists1.append(li)
}

const leaveUserGroup = (leaveGroup, user_groupId, li) => {
    const groupDetails = JSON.parse(localStorage.getItem('groupDetails'))
    leaveGroup.addEventListener('click',async() => {
        const res = await axios.delete(`http://localhost:3000/user-groups/delete-user?user_groupId=${user_groupId}`);
        if(res.status === 200) {
            li.remove();
            alert(`You Successfully leaved ${groupDetails.groupName}`)
            localStorage.removeItem('groupDetails');
            window.location.reload();
        }
    })
}

const showGroupsListTitle = () => {
    const contacts = document.getElementById('contacts')
    const userLists = document.createElement('ul');
    userLists.id = 'groupLists';
    const userListsLi = document.createElement('li');
    userListsLi.className = 'contact';
    userLists.append(userListsLi);
    const userListsDiv = document.createElement('div');
    userListsDiv.className = 'wrap';
    userListsLi.append(userListsDiv);
    const userListH3 = document.createElement('h3');
    userListsDiv.append(userListH3)
    userListH3.style.fontWeight = 'bold';
    userListH3.textContent = `My Groups`;
    const closebtn = document.createElement('button');
    userListH3.append(closebtn)
    closebtn.innerHTML = 'Close';
    contacts.append(userLists)
    closebtn.addEventListener('click', () => {
        userLists.remove();
    })
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
    userListH3.textContent = `List of Contacts`;
    userListH3.id = 'userListTitle'
    const closebtn = document.createElement('button');
    userListH3.append(closebtn)
    closebtn.innerHTML = 'Close';
    contacts.append(userLists)
    closebtn.addEventListener('click', () => {
        userLists.remove();
        // document.getElementById('search').hidden = true;
    })
}

const showGroupUserListTitle = () => {
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
    userListH3.textContent = `Group Members`;
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

function isValidURL(str) {
    if(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str)) {
        //  console.log('YES');
         return true;
     } else {
        //  console.log('NO');
         return false;
     }
}

exitChat.onclick = () => {
    window.location.href = '../views/login.html';
    localStorage.removeItem('groupDetails');
    localStorage.removeItem('isAdmin');
}





