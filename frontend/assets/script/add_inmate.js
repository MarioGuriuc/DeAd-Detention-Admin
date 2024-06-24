"use strict";

import {API_ADD_INMATES_URL, FRONT_INMATES_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {extractCenterIdFromUrl, getHeaders, isLogged} from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        }
        else {
            handleNavbar("addInmate", logged);
            const submitButton = document.querySelector(".button-pop-up");
            submitButton.addEventListener("click", submitNewInmate);

            const addCrimeButton = document.getElementById('addCrimeButton');
            const addSentenceButton = document.getElementById('addSentenceButton');

            addCrimeButton.addEventListener('click', () => {
                addNewInputField('crime', 'crimesContainer');
            });

            addSentenceButton.addEventListener('click', () => {
                addNewInputField('sentence', 'sentencesContainer');
            });
        }
    });
});

function addNewInputField(name, containerId) {
    const container = document.getElementById(containerId);
    const input = document.createElement('input');
    input.name = name;
    input.type = 'text';
    input.required = true;
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
    container.appendChild(document.createElement('br'));
}

function submitNewInmate() {
    const inmateName = document.getElementById("inmateName").value;
    const crimes = Array.from(document.getElementsByName("crime")).map(input => input.value);
    const sentences = Array.from(document.getElementsByName("sentence")).map(input => input.value);
    const image = document.getElementById("image").files[0];

    if (inmateName && crimes.length > 0 && sentences.length > 0 && image) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result.split(',')[1];

            const formData = {
                name: inmateName,
                crimes: crimes,
                sentences: sentences,
                image: imageData
            };

            addInmate(formData);
        };
        reader.readAsDataURL(image);
    }
    else {
        openPopup("All fields are required.");
    }
}

function addInmate(formData) {
    const centerId = extractCenterIdFromUrl();
    const url = API_ADD_INMATES_URL.replace("{center_id}", centerId);

    fetch(url, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(formData)
    })
        .then(response => response.json()
            .then(data => ({status: response.status, body: data}))
            .catch(() => ({status: response.status, body: {}})))
        .then(({status, body}) => {
            openPopup(body["result"]);
            if (status === 201) {
                setTimeout(() => {
                    window.location.assign(FRONT_INMATES_URL.replace("{center_id}", centerId));
                }, 2000);
            }
            else if (status === 401) {
                openPopup(body["result"]);
            }
            else {
                openPopup(body["result"]);
            }
        })
        .catch(_ => {
            openPopup('An error occurred while adding the inmate.');
        });
}
