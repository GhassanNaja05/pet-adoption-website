
//This script is shared by all the html pages
//It fetches the templates for the header, footer and navigation menu
//and appends them correctly to the page
//it also handles the clock and refreshes it every second to display the correct time

document.addEventListener("DOMContentLoaded", function () {

    const nav = document.createElement("nav");

    fetch("/getNav")
        .then(res => res.json())
        .then(data => {

            nav.innerHTML = data.content;

            nav.className = "nav-menu";
            const pageName = document.querySelector(`meta[name="page"]`).content;
            console.log(pageName);
            console.log(`a[href = '/${pageName}']`);

            const content = document.querySelector(".content");
            content.insertBefore(nav, content.firstChild);

            const li = document.querySelector(`a[href="/${pageName}"]`).parentElement;
            li.className = "active";

        });

    fetch("/getHeader")
        .then(res => res.json())
        .then(data => {

            const header = document.createElement("header");
            header.innerHTML = data.content;
            document.body.insertBefore(header, document.body.firstChild);
            updateClock();

        });

    fetch("/getFooter")
        .then(res => res.json())
        .then(data => {

            const footer = document.createElement("footer");
            footer.innerHTML = data.content;
            document.body.appendChild(footer);

        });

});

window.addEventListener("load", function() {

    updateClock();
    setInterval(updateClock, 1000);

});

function updateClock(){

    const clock = document.getElementById("clock");
    if (!clock) return;
    const now = new Date();
    clock.innerHTML = String(now.getHours()).padStart(2, '0') + ":"
        + String(now.getMinutes()).padStart(2, '0') + ":"
        + String(now.getSeconds()).padStart(2, '0');

}




