
//This function is called when we submit the form to search for the pet
//We make sure all the fields are filled and then submit the form to the server
//The server then reads the data
function getFindData(event) {

    event.preventDefault();

    const find = document.getElementById("find-pet");
    if (!find) {

        return;

    }


    let animalType;

    for (let i = 0; i < find.elements["pet-type"].length; i++)
        if (find.elements["pet-type"][i].checked)
            animalType = find.elements["pet-type"][i].value;

    if (!animalType) {
        alert("Please select a type.");
        return;
    }

    let breed = [find.elements[animalType + "-breed"].value];
    let age = find.elements["age"].value;
    let gender = find.elements["gender"].value;

    let getsAlong = [];

    for (let i = 0; i < find.elements["get-along"].length; i++)
        if (find.elements["get-along"][i].checked)
            getsAlong.push(find.elements["get-along"][i].value);

    console.log(animalType, breed, age, gender, getsAlong);
    find.submit();

}

//This function is called when the user wants to browse all pets.
//It sets showall to true which asks the server to send all the pets
function showAllPets(event) {

    event.preventDefault();

    const find = document.getElementById("find-pet");
    if (!find) {

        return;

    }

    document.getElementById('showall').value = 'yes';

    find.submit();

}