"use strict";

import {API_EDIT_INMATE_URL, API_INMATES_URL, FRONT_INMATES_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {extractCenterIdFromUrl, extractInmateIdFromUrl, getHeaders, isLogged} from "./utils.js";
import {openPopup} from "./popup.js";

document.addEventListener("DOMContentLoaded", function () {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        } else {
            handleNavbar("inmates", logged);
            loadInmateData();

            const submitButton = document.querySelector(".button-pop-up");
            submitButton.addEventListener("click", submitEditedInmate);

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

function loadInmateData() {
    const inmateId = extractInmateIdFromUrl();
    const centerId = extractCenterIdFromUrl();
    const url = API_INMATES_URL.replace("{center_id}", centerId);

    fetch(url, {
        method: 'GET',
        headers: getHeaders()
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch inmate data');
            }
            return response.json();
        })
        .then(data => {
            const inmateData = data.find(inmate => inmate.id === inmateId);

            if (inmateData) {
                document.getElementById("inmateName").value = inmateData.name;

                const crimesContainer = document.getElementById("crimesContainer");
                crimesContainer.innerHTML = '';
                inmateData.crimes.forEach(crime => {
                    const crimeInput = document.createElement('input');
                    crimeInput.name = 'crime';
                    crimeInput.type = 'text';
                    crimeInput.value = crime;
                    crimesContainer.appendChild(crimeInput);
                    crimesContainer.appendChild(document.createElement('br'));
                    crimesContainer.appendChild(document.createElement('br'));
                });

                const sentencesContainer = document.getElementById("sentencesContainer");
                sentencesContainer.innerHTML = '';
                inmateData.sentences.forEach(sentence => {
                    const sentenceInput = document.createElement('input');
                    sentenceInput.name = 'sentence';
                    sentenceInput.type = 'text';
                    sentenceInput.value = sentence;
                    sentencesContainer.appendChild(sentenceInput);
                    sentencesContainer.appendChild(document.createElement('br'));
                    sentencesContainer.appendChild(document.createElement('br'));
                });

                if (inmateData.image) {
                    const imageInput = document.createElement('img');
                    imageInput.src = 'data:image/jpg;base64,' + inmateData.image;
                    imageInput.alt = inmateData.name;
                    imageInput.width = 200;
                    imageInput.height = 150;
                    document.getElementById("imageContainer").appendChild(imageInput);
                }
            } else {
                openPopup("Inmate not found.");
            }
        })
        .catch(error => {
            console.error('Error loading inmate data:', error);
            openPopup("An error occurred while loading inmate data.");
        });
}

function submitEditedInmate(event) {
    event.preventDefault();

    const inmateName = document.getElementById("inmateName").value;
    const crimes = Array.from(document.querySelectorAll("input[name='crime']")).map(input => input.value);
    const sentences = Array.from(document.querySelectorAll("input[name='sentence']")).map(input => input.value);
    const imageFile = document.getElementById("image").files[0];

    if (inmateName && crimes.length > 0 && sentences.length > 0) {
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const imageData = event.target.result.split(',')[1];

                const formData = {
                    name: inmateName,
                    crimes: crimes,
                    sentences: sentences,
                    image: imageData
                };

                editInmate(formData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            const formData = {
                name: inmateName,
                crimes: crimes,
                sentences: sentences,
            };
            editInmate(formData);
        }
    }

}

function editInmate(formData) {
    const inmateId = extractInmateIdFromUrl();
    const url = API_EDIT_INMATE_URL.replace("{inmate_id}", inmateId);

    fetch(url, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(formData),
    })
        .then(response => response.json()
            .then(data => ({status: response.status, body: data}))
            .catch(() => ({status: response.status, body: {}})))
        .then(({status, body}) => {
            openPopup(body["result"]);
            if (status === 200) {
                setTimeout(() => {
                    window.location.assign(FRONT_INMATES_URL.replace("{center_id}", extractCenterIdFromUrl()));
                }, 2000);
            } else {
                openPopup(body["result"]);
            }
        })
        .catch(_ => {
            openPopup("An error occurred while editing the inmate.");
        });
}
