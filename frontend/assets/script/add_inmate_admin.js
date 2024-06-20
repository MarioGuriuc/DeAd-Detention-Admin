// Author: Vlad

"use strict";

import {API_ADD_INMATES_URL, FRONT_INMATES_URL, API_CENTERS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {setHeaders} from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("addInmate", isLogged());
    loadCenters();
    const inmateForm = document.getElementById("addInmateForm");
    inmateForm.addEventListener("submit", function (event) {
        event.preventDefault();
        submitNewInmate();
    });
});

function loadCenters() {
    const http = new XMLHttpRequest();
    http.open("GET", API_CENTERS_URL, true);
    setHeaders(http);

    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            const centers = JSON.parse(http.responseText);
            const centerSelect = document.getElementById("center");

            centers.forEach(center => {
                const option = document.createElement("option");
                option.value = center.id;
                option.textContent = center.title;
                centerSelect.appendChild(option);
            });
        }
    };

    http.send();
}

function submitNewInmate() {
    const inmateName = document.getElementById("inmateName").value;
    const crime = document.getElementById("crime").value;
    const sentence = document.getElementById("sentence").value;
    const centerId = document.getElementById("center").value;
    const image = document.getElementById("image").files[0];

    if (inmateName && crime && sentence && centerId && image) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageData = event.target.result.split(',')[1];
                const formData = {
                    name: inmateName,
                    crime: crime,
                    sentence: sentence,
                    image: imageData
                };
                addInmate(formData, centerId);
            };
            reader.readAsDataURL(image);
    } else {
        alert("All fields are required.");
    }
}

function addInmate(formData, centerId) {
    const http = new XMLHttpRequest();
    http.open("PUT", API_ADD_INMATES_URL.replace("{center_id}", centerId), true);
    setHeaders(http);

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            switch (http.status) {
                case 201:
                    setTimeout(() => {
                        alert("Inmate added successfully.")
                        window.location.assign(FRONT_INMATES_URL.replace("{center_id}", centerId));
                    }, 2000);
                    break;
                case 401:
                    alert("Unauthorized. Please log in again.");
                    break;
                default:
                    alert("Failed to add inmate. Please try again later.");
            }
        }
    };
    http.send(JSON.stringify(formData));
}
