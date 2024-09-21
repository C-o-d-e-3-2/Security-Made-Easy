var userInput = document.getElementById('usernameInput');
var passInput = document.getElementById('passwordInput');
const base_url = 'https://glowing-capybara-5g5qx597qw434j5v-3000.app.github.dev';

if(localStorage.getItem('loggedIn') == null) {
    localStorage.setItem('loggedIn', 'false');
    localStorage.removeItem('username');
}

if (localStorage.getItem('loggedIn') == 'true') {
    window.location = './dashboard.html';
}

if (localStorage.getItem('userInputValue') == null) {
    localStorage.setItem('userInputValue', '');
}

if (localStorage.getItem('passInputValue') == null) {
    localStorage.setItem('passInputValue', '');
}

userInput.value = localStorage.getItem('userInputValue');  
passInput.value = localStorage.getItem('passInputValue');

userInput.addEventListener('change', () => {
    localStorage.setItem('userInputValue', userInput.value)
})

passInput.addEventListener('change', () => {
    localStorage.setItem('passInputValue', passInput.value)
})

function logIn() {
    if (userInput.value && userInput.value) {
        fetch(base_url + '/employee/login/', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ username: userInput.value, password: passInput.value }),
        })
        .then((res)=> res.json())
        .then((response)=>{
        if(response == true) {
            localStorage.removeItem('userInputValue');
            localStorage.removeItem('passInputValue');
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', userInput.value);
            window.location = './dashboard.html';
        } else {
            alert('Login failed. Please try again.');
            localStorage.removeItem('userInputValue');
            localStorage.removeItem('passInputValue');
            window.location.reload();
        }
        })
    } else {
        alert('You must enter a username and password.')
    }
}