// Author: Mario Guriuc

import {API_ADD_CENTER_URL, FRONT_CENTERS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./utils.js";
import {openPopup} from "./popup.js";
import {setHeaders} from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", () => {
    handleNavbar("addCenter", true);
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
    http.open('PUT', API_ADD_CENTER_URL, true);

    setHeaders(http);

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            const response = JSON.parse(http.responseText);
            switch (http.status) {
                case 201:
                    openPopup(response["result"]);
                    setTimeout(() => {
                        window.location.assign(FRONT_CENTERS_URL);
                    }, 2000);
                    break;
                default:
                    openPopup(response["result"]);
            }
        }
    };

    http.send(JSON.stringify(data));
}
