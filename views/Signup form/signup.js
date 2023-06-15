const btn = document.getElementById('submit');

btn.addEventListener('click', (e) => {
    e.preventDefault();

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;

    let signupDetails = {
        name,
        email,
        phoneNumber,
        password
    }

    axios.post('http://localhost:3000/user/signup-user', signupDetails).then(response => {
        alert(response.data.message)
        console.log(response.data.message);
    }).catch(err => {
        console.log(err);
    })
})