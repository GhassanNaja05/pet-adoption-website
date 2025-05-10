
//Importing required modules

const express = require('express');
const app = express();
const PORT = 3000;
const session = require('express-session')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret : "doudoulapin" }))

const fs = require('fs');

//users will hold username and password pairs
//pets will hold pets with their info (type, breed, age...)
const users = [];
const pets = [];

//reading pets and user pairs from the files
let nextId = 1;
loadPetsFromFile();
loadUsersFromFile();

//The following are files containing html for different utilities in the website
//This will allow us to load things such as headers, footers and forms by fetching from the server
const header = fs.readFileSync('./HTMLContent/header.html', 'utf8');
const footer = fs.readFileSync('./HTMLContent/footer.html', 'utf8');
const nav = fs.readFileSync('./HTMLContent/nav.html', 'utf8');
const signupForm = fs.readFileSync('./HTMLContent/signupForm.html', 'utf8');
const giveawayForm = fs.readFileSync('./HTMLContent/giveawayForm.html', 'utf8');
const userLogin = fs.readFileSync('./HTMLContent/userLogin.html', 'utf8');
const giveawaySuccess = fs.readFileSync('./HTMLContent/successful_pet_registered.html', 'utf8');



//The following get requests are to return the values read from html earlier
app.get('/giveaway-success', (req, res) => {
    
    res.json({ giveawaySuccess : giveawaySuccess });

});

app.get('/getGiveawayForm', (req, res) => {

    res.json( {content : giveawayForm} );

});

app.get('/getUserLogin', (req, res) => {

    res.json( {content : userLogin} );

});

app.get('/getHeader', (req, res) => {

    res.json( {content : header} );

});

app.get('/getFooter', (req, res) => {

    res.json( {content : footer} );

});

app.get('/getNav', (req, res) => {

    res.json( {content : nav} );

});

app.get('/getSignupForm', (req, res) => {

    res.json( {content : signupForm} );

});


//Post requests used when submitting various forms

//When submitting a pet to giveaway. We read the data then save it in the pets array
//and write to the pets.txt file
app.post('/submit-giveaway-form', (req, res) => {


    const newPet = {};

    newPet['type'] = req.body['animal-type'];
    newPet['breed'] = req.body[`${newPet['type']}-breed`];
    if (!Array.isArray(newPet.breed)) newPet.breed = [newPet.breed];
    newPet['gender'] = req.body.gender;
    newPet['age'] = req.body.age;
    newPet['getsAlong'] = req.body['gets-along'] || [];
    if (!Array.isArray(newPet.getsAlong)) newPet.getsAlong = [newPet.getsAlong];
    newPet['suitsChildren'] = req.body['suitable-children'];
    newPet['comment'] = req.body.comment;
    newPet['name'] = req.body['prev-name'];
    newPet['email'] = req.body['owner-email'];

    console.log(newPet);

    savePetToFile(req.session.username, nextId++, newPet);

    pets.push(newPet);
    res.redirect('/giveaway?successStatus=success');

});

//When creating a new user, we save the username/password pair in users array
//as well as in the users.txt file
app.post('/new-user', (req, res) => {

    const newUser = {

        username : req.body.username,
        password: req.body.password

    };

    users.push(newUser);

    saveUserToFile(newUser.username, newUser.password);

    req.session.username = undefined;
    res.redirect('/signup?newUser=true');

});

//When we submit our search criteria in find pet
//We pass them to searchPet function which checks which pets match the criteria
//and saves them as result in the session
//We then load the browse page that fetches this data from the server to display the result
//If the user wants to see all pets we immediately load browse without searching with the criteria
app.post('/search-pet', (req, res) => {

    if (req.body.showall === "yes") {

        req.session.result = pets;
        res.redirect('/browse')

    } else {

        console.log(req.body);

        const criteria = {

            type: req.body['pet-type'],
            breed: req.body[`${req.body['pet-type']}-breed`] || [],
            age: req.body.age,
            gender: req.body.gender,
            getsAlong: req.body['get-along'] || []

        };

        const result = searchPet(criteria);
        console.log(result);
        req.session.result = result;

        res.redirect('/browse');

    }

});

//When the user wants to log in. We check to see if the username exists
//and if so, if the password is correct
app.post('/login', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const v = validateUser(username)

    if (v.userAlreadyExists) {

        if (users[v.index].password === password) {

            req.session.username = username;
            res.redirect('/giveaway');

        }
        else (res.redirect('giveaway?fail-status=wrong-password'))

    }
    else res.redirect('/giveaway?fail-status=user-dne');

});


//This request is called by the browse page to get the results of the pet search we did
//when finding pet based on search criteria
app.get('/get-search-result', (req, res) => {

    res.json(req.session.result);

});

//default request that redirects us to home
app.get('/', (req, res) => {

    res.redirect('/home');

});

//Same logic to handle all menu pages. we send the data from the corresponding file
app.get(['/home', '/find', '/signup', '/contact', '/catcare', '/dogcare', '/giveaway', '/browse', '/logout'], (req, res) => {

    fs.readFile(`./HTMLContent${req.path}.html`, (err, data) => {

        res.setHeader('Content-Type', 'text/html');
        if (!err) res.send(data);
        else res.send("ERROR");

    });

});

//When the user logs out, we delete their username from the session and redirect to home
//They will need to log in again to give aweay new pets
app.get('/log-out', (req, res) => {

    req.session.username = undefined;
    res.redirect('/home');

});

//This will return whether the user already exists or not and the index of the user in the array
//useful when checking if user already exists
app.get('/validate-user', (req, res) => {

    const v = validateUser(req.query.username)

    res.json( v );

});

//This will send the username if it is stored in the session
app.get('/get-username', (req, res) => {

    if (req.session.username) res.send( { username : req.session.username, success : true } );
    else res.send( { success : false } );

});

//this will send the username without checking if it exists or not
app.get('/userInfo', (req, res) => {

    res.json( { username : req.session.username } );

});

//Listening on the provided port
app.listen(PORT, () => {

    console.log(`Listening on port ${PORT}`);

});

//Checking if user already exists and finding their index in the array if so
function validateUser(username) {


    let userInfo = {userAlreadyExists : false, index : -1}

    for (let i = 0; i < users.length; i++) {

        if (users[i].username === username) {

           userInfo.userAlreadyExists = true;
           userInfo.index = i;
            break;

        }

    }

    return userInfo;

}

//searching pet based on the search criteria provided
//We have a for loop that goes through all the pets and appends them to the result
//at the end of the iteration. If the pet attributes don't match any of the criteria
//we skip the current iteration without appending
function searchPet(criteria) {

    const type = criteria.type;
    const breed = criteria.breed;
    const age = criteria.age;
    const gender = criteria.gender;
    const getAlongs = criteria.getsAlong;
    const getsAlongCats = getAlongs.includes('cats');
    const getsAlongDogs = getAlongs.includes('dogs');
    const getsAlongChildren = getAlongs.includes('children');

    const result = [];

    console.log(type, breed, age, gender, getsAlongCats, getsAlongDogs, getsAlongChildren);

    for (let i = 0; i < pets.length; i++) {

        if (type !== pets[i].type) {
            console.log("1");
            continue;
        }
        if (breed !== 'doesntmatter' && !pets[i].breed.includes(breed)) {
            console.log("2");
            continue;
        }
        if (gender !== 'doesntmatter' && gender !== pets[i].gender) {
            console.log("3");
            continue;
        }
        if (age !== 'doesntmatter' && age !== pets[i].age) {
            console.log("3.5");
            continue;
        }
        if (getsAlongCats && !pets[i].getsAlong.includes('cats')) {
            console.log("4");
            continue;
        }
        if (getsAlongDogs && !pets[i].getsAlong.includes('dogs')) {
            console.log("5");
            continue;
        }
        if (getsAlongChildren && pets[i].suitsChildren === 'no') {
            console.log("6");
            continue;
        }

        result.push(pets[i]);

    }


    return result;

}

//functions to save user info and pet info to file in desired format
function saveUserToFile(username, password) {

    const line = `${username}:${password}\n`;
    fs.appendFileSync('users.txt', line, 'utf8');

}

function savePetToFile(username, id, pet) {


    pet.breed = Array.isArray(pet.breed) ? pet.breed : [pet.breed];

    let comment = pet.comment;
    comment = comment.replace(':', "_");

    let petName = pet.name;
    petName =  petName.replace(':', "_");

    const line = `${id}:${username}:${pet.type}:${pet.breed.join(',')}:${pet.gender}:${pet.age}:${pet.getsAlong.join(',')}:${pet.suitsChildren}:${comment}:${petName}:${pet.email}\n`;
    console.log(line);
    fs.appendFileSync('pets.txt', line, 'utf8');

}

//functions to load user info and pet info from the files
function loadUsersFromFile() {

    if (!fs.existsSync('users.txt')) return;

    const lines = fs.readFileSync('users.txt', 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {

        const line = lines[i]
        if (line.trim() === '') continue;
        const [username, password] = line.split(':');
        users.push({ username, password });

    }

}

function loadPetsFromFile() {

    if (!fs.existsSync('pets.txt')) return;

    const lines = fs.readFileSync('pets.txt', 'utf8').split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') continue;

        const [
            id, username, type, breed, gender, age,
            getsAlong, suitsChildren,
            comment, name, email
        ] = line.split(':');

        nextId = id + 1;

        pets.push({
            type : type,
            breed : breed.split(','),
            gender : gender,
            age : age,
            getsAlong : getsAlong ? getsAlong.split(',') : [],
            suitsChildren : suitsChildren,
            comment : comment,
            name : name,
            email : email
        });
    }
}






