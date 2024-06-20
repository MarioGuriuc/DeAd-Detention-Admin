"use strict";

import {API_ADD_VISIT_URL, FRONT_VISITS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged, getUsernameFromJwt} from "./jwt.js";
import {extractCenterIdFromUrl, extractInmateIdFromUrl, setHeaders} from "./utils.js";
import {openPopup} from "./popup.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("addVisit", isLogged());
    const submitButton = document.getElementById("add-visit-btn");
    submitButton.addEventListener("click", submitNewVisit);
});

function submitNewVisit(event) {
    event.preventDefault();

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const duration = parseFloat(document.getElementById("duration").value);
    const nature = document.getElementById("nature").value;
    const objectsExchanged = document.getElementById("objects_exchanged").value;
    const summary = document.getElementById("summary").value;
    const health = document.getElementById("health").value;
    const witnesses = parseInt(document.getElementById("witnesses").value, 10);

    const currentDate = new Date();
    const selectedDate = new Date(date);

    if (!date || !time || !duration || !nature || !objectsExchanged || !summary || !health || !witnesses) {
        openPopup("All fields are required.");
        return;
    }

    if (selectedDate <= currentDate) {
        openPopup("The date of the visit must be in the future.");
        return;
    }

    if (witnesses <= 0) {
        openPopup("The number of witnesses must be a positive number.");
        return;
    }

    if (duration <= 0) {
        openPopup("The duration must be a positive number.");
        return;
    }

    const formData = {
        date: date,
        time: time,
        duration: duration,
        nature: nature,
        objectsExchanged: objectsExchanged,
        summary: summary,
        health: health,
        witnesses: witnesses,
        user: getUsernameFromJwt()
    };

    addVisit(formData);
}

function addVisit(formData) {
    const http = new XMLHttpRequest();
    const centerId = extractCenterIdFromUrl();
    http.open("PUT", API_ADD_VISIT_URL.replace("{center_id}", centerId).replace("{inmate_id}", extractInmateIdFromUrl), true);

    setHeaders(http)

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            const response = JSON.parse(http.responseText);
            switch (http.status) {
                case 201:
                    openPopup(response["result"]);
                    setTimeout(() => {
                        window.location.assign(FRONT_VISITS_URL.replace("{username}", getUsernameFromJwt));
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
