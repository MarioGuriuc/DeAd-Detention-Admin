// Author: Mario Guriuc

import {API_ADD_CENTER_URL, FRONT_CENTERS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {getHeaders, isLogged} from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    isLogged(logged => {
        if (!logged) {
            window.location.assign(FRONT_CENTERS_URL);
        }
        else {
            handleNavbar("addCenter", true);
            const addCenterButton = document.getElementById('add-center-btn');
            addCenterButton.addEventListener('click', addCenter);

            function addCenter() {
                const reader = new FileReader();
                reader.onload = (image) => {
                    const imageData = image.target.result.split(',')[1];
                    fetch(API_ADD_CENTER_URL, {
                        method: 'PUT',
                        headers: getHeaders(),
                        body: JSON.stringify({
                            name: document.getElementById('centerName').value,
                            location: document.getElementById('location').value,
                            description: document.getElementById('description').value,
                            image: imageData
                        })
                    }).then(response => {
                        if (response.status === 201) {
                            setTimeout(() => {
                                window.location.assign(FRONT_CENTERS_URL);
                            }, 1000);
                        }
                        return response.json();
                    }).then(json => {
                        openPopup(json["result"]);
                    }).catch(_ => {
                        openPopup("Unexpected error, please try again later.");
                    });
                };
                const image = document.getElementById('image').files[0];
                reader.readAsDataURL(image);
            }
        }
    });
});
