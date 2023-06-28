const close = document.getElementById('close');

close.addEventListener('click', () => {
    window.location.href = '../views/chatApp.html';
})

const submitbtn = document.getElementById('submitGroup')

submitbtn.addEventListener('click', createGroup)

async function createGroup (e) {
    try {
    e.preventDefault();

    const groupName = document.getElementById('groupName').value;

    const groupObj = {
        groupName
    }

    const token = localStorage.getItem('token');

    const res = await axios.post('http://localhost:3000/user-groups/add-group', groupObj, { headers: {"Authorization": token }});
    console.log(res); 
    localStorage.setItem('groupDetails', JSON.stringify(res.data.newGroup));
    document.getElementById('showResponse').textContent = res.data.message;
    document.getElementById('showResponse').style.color = 'green';
    const groupId = res.data.newGroup.id;
    alert(res.data.message)
    localStorage.setItem('link',`http://localhost:3000/chat.html/${groupId}`)
    window.location.href = `../views/chatApp.html?groupId=${groupId}`;
    } catch(err) {
        console.log(err);
        document.getElementById('showResponse').textContent = err.response.data.error;
        document.getElementById('showResponse').style.color = 'red';
    }
}


