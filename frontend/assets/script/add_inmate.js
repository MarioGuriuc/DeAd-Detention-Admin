// Author: Vlad

"use strict";

import {API_ADD_INMATES_URL, FRONT_INMATES_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {extractCenterIdFromUrl, setHeaders} from "./utils.js";
import {openPopup} from "./popup.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("addInmate", isLogged());
    const submitButton = document.getElementById("add-inmate-btn");
    submitButton.addEventListener("click", submitNewInmate);
});

function submitNewInmate() {
    const inmateName = document.getElementById("inmateName").value;
    const crime = document.getElementById("crime").value;
    const sentence = document.getElementById("sentence").value;
    const image = document.getElementById("image").files[0];

    if (inmateName && crime && sentence && image) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result.split(',')[1];

            const formData = {
                name: inmateName,
                crime: crime,
                sentence: sentence,
                image: imageData
            };

            addInmate(formData);
        };
        reader.readAsDataURL(image);
    } else if (inmateName && crime && sentence) {
        const formData = {
            name: inmateName,
            crime: crime,
            sentence: sentence
        };
        addInmate(formData);
    } else {
        openPopup("All fields are required.");
    }
}


function addInmate(formData) {
    const http = new XMLHttpRequest();
    const centerId = extractCenterIdFromUrl();
    http.open("PUT", API_ADD_INMATES_URL.replace("{center_id}", centerId), true);
    setHeaders(http)

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            const response = JSON.parse(http.responseText);
            switch (http.status) {
                case 201:
                    openPopup(response["result"]);
                    setTimeout(() => {
                        window.location.assign(FRONT_INMATES_URL.replace("{center_id}", centerId));
                    }, 2000);
                    break;
                case 401:
                    openPopup(response["result"]);
                    break;
                default:
                    openPopup(response["result"]);
            }
        }
    };

    http.send(JSON.stringify(formData));
}
