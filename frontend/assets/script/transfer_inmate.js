// Author: Vlad

import {API_ALL_CENTERS_URL, API_TRANSFER_INMATE_URL, FRONT_INMATES_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {extractInmateIdFromUrl, getHeaders, isLogged} from "./utils.js";

document.addEventListener('DOMContentLoaded', function () {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        }
        else {
            handleNavbar("inmates", logged).then(() => {
                loadCenters();

                const transferButton = document.getElementById('transferButton');
                transferButton.addEventListener('click', transferInmate);
            });
        }
    });
});

function loadCenters() {
    fetch(API_ALL_CENTERS_URL, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(centers => {
            const centerSelect = document.getElementById("center");
            centers.forEach(center => {
                const option = document.createElement("option");
                option.value = center.id;
                option.textContent = center.title;
                centerSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Failed to load centers:', error);
        });
}

function transferInmate() {
    const inmateId = extractInmateIdFromUrl();
    const newCenterId = document.getElementById('center').value;

    fetch(API_TRANSFER_INMATE_URL.replace('{inmate_id}', inmateId).replace("{center_id}", newCenterId), {
        method: 'PATCH',
        headers: getHeaders(),
        credentials: 'include',
    })
        .then(response => response.json())
        .then(data => {
            openPopup(data['result']);
            if (data['result'] === 'Inmate transferred successfully') {
                setTimeout(() => {
                    window.location.assign(FRONT_INMATES_URL.replace("{center_id}", newCenterId));
                }, 2000);
            }
        })
        .catch(error => {
            openPopup('An error occurred while transferring the inmate.');
            console.error('Failed to transfer inmate:', error);
        });
}
