"use strict";

import {API_EDIT_CENTER_URL, API_ONE_CENTER_URL, FRONT_CENTERS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {extractCenterIdFromUrl, getHeaders, isLogged} from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        }
        else {
            handleNavbar("centers", logged).then(r => {
                loadCenterData();

                const submitButton = document.getElementById("add-center-btn");
                submitButton.addEventListener("click", submitEditedCenter);
            });
        }
    });
});

function loadCenterData() {
    const centerId = extractCenterIdFromUrl();
    const url = API_ONE_CENTER_URL.replace("{center_id}", centerId);

    fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credential: 'include'
    })
        .then(response => response.json()
            .then(data => ({status: response.status, body: data}))
            .catch(() => ({status: response.status, body: {}})))
        .then(({status, body}) => {
            if (status === 200) {
                const centerData = body.center;
                if (centerData) {
                    document.getElementById("centerName").value = centerData.title;
                    document.getElementById("location").value = centerData.location;
                    document.getElementById("description").value = centerData.description;

                    if (centerData.image) {
                        const imageInput = document.createElement('img');
                        imageInput.src = 'data:image/jpg;base64,' + centerData.image;
                        imageInput.alt = centerData.name;
                        imageInput.width = 200;
                        imageInput.height = 150;
                        document.getElementById("imageContainer").appendChild(imageInput);
                    }

                }
                else {
                    openPopup("Center not found.");
                }
            }
            else {
                openPopup("Failed to load center data.");
            }
        })
        .catch(_ => {
            openPopup("An error occurred while loading center data.");
        });
}

function submitEditedCenter(event) {
    event.preventDefault();

    const title = document.getElementById("centerName").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const imageFile = document.getElementById("image").files[0];

    if (!title || !location || !description) {
        openPopup("All fields are required.");
        return;
    }

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imageData = event.target.result.split(',')[1];

            const formData = {
                title: title,
                location: location,
                description: description,
                image: imageData
            };

            editCenter(formData);
        };
        reader.readAsDataURL(imageFile);
    }
    else {
        const formData = {
            title: title,
            location: location,
            description: description,
        };

        editCenter(formData);
    }
}

function editCenter(formData) {
    const centerId = extractCenterIdFromUrl();
    const url = API_EDIT_CENTER_URL.replace("{center_id}", centerId);

    fetch(url, {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(formData)
    })
        .then(response => response.json()
            .then(data => ({status: response.status, body: data}))
            .catch(() => ({status: response.status, body: {}})))
        .then(({status, body}) => {
            openPopup(body["result"]);
            if (status === 200) {
                setTimeout(() => {
                    window.location.assign(FRONT_CENTERS_URL);
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
            openPopup("An error occurred while editing the center.");
        });
}
