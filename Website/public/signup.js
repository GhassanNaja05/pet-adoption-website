
//This script handles signing up users
//We load the form by fetching it from the server
//We then validate the username/password pair entered by the user
//We request from the server to see if user already exists before submitting the form

document.addEventListener('DOMContentLoaded', () => {

    const url = new URLSearchParams(window.location.search);
    const newUser = url.get('newUser') === "true";
    if (!newUser) loadForm()
    else {

        const h = document.createElement('h1');
        h.innerHTML = "Successfully created account! You can sign in any time you want.";
        document.getElementById('user-info').appendChild(h);

    }

});

function loadForm() {

    fetch('/getSignupForm')
        .then(res => res.json())
        .then(data => { document.getElementById('user-info').innerHTML = data.content })

}

async function submitNewUser(event) {

    event.preventDefault();

    const form = document.getElementById("new-acc-form");
    if (!form) return;

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (!username.value) {

        alert("Please enter a username.");
        return;

    }

    if (!validateUsername(username.value)) {

        alert("Please enter a valid username. Username can only contain letters and digits");
        return;

    }

    let userAlreadyExists;

    await fetch("/validate-user?username=" + username.value)
        .then(res => res.json()).then(data => {

            userAlreadyExists = data.userAlreadyExists;

    });

    if (userAlreadyExists) {

        alert("User already exists!");
        return;

    }

    if (!validatePassword(password.value)) {

        alert("Please enter a valid password");
        return;

    }

    form.submit();

}

function validatePassword(p) {

    p = String(p);
    const test = /^(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z]{4,}$/
    return test.test(p);

}

function validateUsername(username) {

    username = String(username);
    const test = /^[A-Za-z0-9]+$/;
    return test.test(username);

}