
//This script checks if a user is logged in by requesting the username and see if it exists
//If it exists, it display the giveaway form for the user.
//If not, it display a log in menu
//Both the form and the menu are fetched from the server

//It also validates the giveaway form before submitting to the server
//and displays a success message afterwards

// When entering username and password we also validate them to check if they
// follow the correct criteria, and see if user doesn't exist or password is incorrect

let username = undefined;

document.addEventListener('DOMContentLoaded', () => {

    const main = document.getElementById('giveaway-main');

    const url = new URLSearchParams(window.location.search);
    if (url.get('successStatus') === 'success') fetch('/giveaway-success')
        .then(res => res.json())
        .then((data) => {

        main.innerHTML = data.giveawaySuccess;

    });

    else fetch('/userInfo').then(res => res.json()).then(data => {

        username = data.username;
        const get = username ? '/getGiveawayForm' : '/getUserLogin'

        fetch(get).then(res => res.json()).then(data => {

            main.innerHTML = data.content;

            if (!username) {

                main.className = 'login-main';

                const error = url.get('fail-status');
                const e = document.getElementById('wrong-password');
                e.hidden = !error;
                if (error === "wrong-password") e.innerHTML = "Wrong Password";
                else if (error === "user-dne") e.innerHTML = "User does not exist. Create account first";

            } else {

                document.getElementById('greeting').innerHTML =
                    `Hello ${username}, please fill out this form to give away a pet.`;

            }

        });

    });

});

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

function submitLogin(event) {

    event.preventDefault();

    const form = document.getElementById('login-form');
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (!username.value || !password.value) {

        alert("Please fill all fields");
        return;

    }

    if (!validateUsername(username.value)) {

        alert("Username is not in valid format");
        return;

    }

    if (!validatePassword(password.value)) {

        alert("Password is not in a valid format");
        return;

    }

    form.submit();

}

function giveaway(event) {

    event.preventDefault();

    getGiveawayData();

}

function getGiveawayData() {

    const giveaway = document.getElementById("giveaway");
    if (!giveaway) return;

    let animalType;

    for (let i = 0; i < giveaway.elements["animal-type"].length; i++)
        if (giveaway.elements["animal-type"][i].checked)
            animalType = giveaway.elements["animal-type"][i].value;

    if (!animalType) {
        alert("Please select a type.");
        return;
    }


    let breed = [];

    for (let i = 0; i < giveaway.elements[animalType + "-breed"].length; i++)
        if (giveaway.elements[animalType + "-breed"][i].checked)
            breed.push(giveaway.elements[animalType + "-breed"][i].value);


    if (!breed.length) {
        alert("Please select at least one " + animalType + " breed.");
        return;
    }

    let age = giveaway.elements["age"].value;


    let gender;

    for (let i = 0; i < giveaway.elements["gender"].length; i++)
        if (giveaway.elements["gender"][i].checked)
            gender = giveaway.elements["gender"][i].value;

    if (!gender) {
        alert("Please select a gender.");
        return;
    }


    let getsAlong = [];

    for (let i = 0; i < giveaway.elements["gets-along"].length; i++)
        if (giveaway.elements["gets-along"][i].checked)
            getsAlong.push(giveaway.elements["gets-along"][i].value);


    let suitableChildren;

    for (let i = 0; i < giveaway.elements["suitable-children"].length; i++)
        if (giveaway.elements["suitable-children"][i].checked)
            suitableChildren = giveaway.elements["suitable-children"][i].value;

    if (!suitableChildren) {
        alert("Is your pet suitable for children? Please select a value.");
        return;
    }


    let comment = giveaway.elements["comment"].value.toString();


    let prevName = giveaway.elements["prev-name"].value.toString();

    if (!prevName) {
        alert("Please enter pet's previous name.");
        return;
    }


    let email = giveaway.elements["owner-email"].value.toString();

    if (!validateEmail(email.toString())) {
        alert("Please enter valid email.");
        return;
    }

    console.log(animalType, breed, age, gender, getsAlong, suitableChildren, comment, prevName, email);
    giveaway.submit();

}

function validateEmail(email) {

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    const specialCharacters = /[.\-_]{2}/


    if (specialCharacters.test(email)) return false;

    return emailPattern.test(email);

}
