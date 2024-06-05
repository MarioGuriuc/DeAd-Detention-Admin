// Author: Mario Guriuc

"use strict";

import {API_ADD_CENTER_URL, FRONT_CENTERS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {openPopup} from "./popup.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("add-center", true);
    const addCenterButton = document.getElementById('add-center-btn');
    addCenterButton.addEventListener('click', addCenter);
});

function addCenter() {
    const name = document.getElementById('centerName').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').files[0];

    if (name && location && description && image) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result.split(',')[1];
            console.log(imageData);
            const data = {
                name: name,
                location: location,
                description: description,
                image: imageData
            };
            submitAddCenterRequest(data);
        };
        reader.readAsDataURL(image);
    }
}

function submitAddCenterRequest(data) {
    const http = new XMLHttpRequest();

    http.open('PUT', 'http://localhost:8000/api/centers', true);

    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('JWT'));

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            const response = JSON.parse(http.responseText);
            switch (http.status) {
                case 200:
                    openPopup(response["result"]);
                    setTimeout(() => {
                        window.location.assign(FRONT_CENTERS_URL);
                    }, 2000);
                    break;
                case 401:
                    openPopup(response["result"]);
            }
        }
    };

    http.send(JSON.stringify(data));
}
