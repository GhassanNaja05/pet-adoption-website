//This script allows us to load the content of the browse page
//from an array of Pet objects. Each object has the necessary data
//to display on the page.
//If we want to add/remove a pet or edit a pet, we simply change it
//from the array then call updatePetList()

//The different pet objects are created by fetching the info from the server
//as soon as the page loads. we format the data correctly, interpret it, and then display the pets

window.addEventListener("load", function(){

    fetch('/get-search-result').then( res => res.json()).then((data) => {

        petList = []

        for (let i = 0; i < data.length; i++) {

            petList.push(new Pet(

                `/Images/DLPic1${Math.floor(Math.random() * 10)}.jpeg`,
                data[i].type,
                data[i].breed,
                data[i].age,
                data[i].gender,
                data[i].getsAlong,
                data[i].suitsChildren,
                data[i].comment,
                data[i].name,
                data[i].email

            ));

        }

        updatePetList();

    });

});

function updatePetList(){

    const listDiv = document.getElementById("pet-list");


    if (!listDiv) return;

    listDiv.innerHTML = "";

    for (let i = 0; i < petList.length; i++)
        listDiv.innerHTML += petList[i].formatDiv(i);
            


}

class Pet {
    constructor(image, typee, breed, age, gender, getAlong, suitsFamily, comment, prevName, ownerEmail) {
        this.image = image;
        this.typee = typee;
        this.breed = Array.isArray(breed) ? breed : [breed];
        this.age = age;
        this.gender = gender;
        this.getAlong = Array.isArray(getAlong) ? getAlong : [getAlong];
        this.suitsFamily = suitsFamily;
        this.comment = comment;
        this.prevName = prevName;
        this.ownerEmail = ownerEmail;

    }

    formatDiv(index) {

        const getAlongFormat = this.getAlong.length == 0 ? "no one." : this.getAlong.join(", ");
        const breedFormat = this.breed.length == 1 ? this.breed[0] : (this.breed.join(", ")
            + " (Mixed Breed)");

        const txt = "<div class=\"pet-info\">" +
            "<img src=\"" + this.image + "\" alt=\"Picture!!!!!\">" +
            "<ul>" +
            "<li class=\"name\">" + this.prevName + "</li>" +
            "<li><b>Type: </b>" + this.typee + "</li>" +
            "<li><b>Breed: </b>" + breedFormat + "</li>" +
            "<li><b>Age: </b>" + this.age + "</li>" +
            "<li><b>Gender: </b>" + this.gender + "</li>" +
            "<li><b>Gets along with: </b>" + getAlongFormat + "</li>" +
            "<li><b>Suitable for children: </b>" + (this.suitsFamily ? "yes" : "no") + "</li>" +
            "<li><b>Comments:</b><br>" + (this.comment ? this.comment : "none") + "</li>" +
            "<li><b>Owner's email: </b>" + this.ownerEmail + "</li>" +
            "</ul>" +
            "<button id=\"like" + index + "\" class='like'>♥</button>" +
            "</div>";


        return txt;

    }

}

let petList = [];


