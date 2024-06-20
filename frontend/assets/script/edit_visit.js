"use strict";

import {API_EDIT_VISIT_URL, FRONT_VISITS_URL, API_VISITS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged, getUsernameFromJwt} from "./jwt.js";
import {extractVisitIdFromUrl, setHeaders} from "./utils.js";
import {openPopup} from "./popup.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("visits", isLogged());
    loadVisitData();

    const submitButton = document.getElementById("add-visit-btn")
    submitButton.addEventListener("click", submitEditedVisit);
});

function loadVisitData() {
    const visitId = extractVisitIdFromUrl();
    const username = getUsernameFromJwt();
    const http = new XMLHttpRequest();
    http.open("GET", API_VISITS_URL.replace("{username}", username), true);

    setHeaders(http);

    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            const visitsData = JSON.parse(http.responseText);
            const visitData = visitsData.visits.find(visit => visit.id === visitId);

            if (visitData) {
                document.getElementById("date").value = visitData.date;
                document.getElementById("time").value = visitData.time;
                document.getElementById("duration").value = visitData.duration;
                document.getElementById("nature").value = visitData.nature;
                document.getElementById("objectsExchanged").value = visitData.objectsExchanged;
                document.getElementById("summary").value = visitData.summary;
                document.getElementById("health").value = visitData.health;
                document.getElementById("witnesses").value = visitData.witnesses;

                if (visitData.status === "attended") {
                    document.getElementById("date").disabled = true;
                    document.getElementById("time").disabled = true;
                    document.getElementById("duration").disabled = true;
                    document.getElementById("nature").disabled = true;
                    document.getElementById("objectsExchanged").disabled = true;
                    document.getElementById("health").disabled = true;
                    document.getElementById("witnesses").disabled = true;
                }
            } else {
                openPopup("Visit not found.");
            }
        }
    };

    http.send();
}

function submitEditedVisit(event) {
    event.preventDefault();

    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const duration = parseFloat(document.getElementById("duration").value);
    const nature = document.getElementById("nature").value;
    const objectsExchanged = document.getElementById("objectsExchanged").value;
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
        witnesses: witnesses
    };

    editVisit(formData);
}

function editVisit(formData) {
    const http = new XMLHttpRequest();
    const visitId = extractVisitIdFromUrl();
    http.open("PATCH", API_EDIT_VISIT_URL.replace("{visit_id}", visitId), true);
    setHeaders(http);

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            const response = JSON.parse(http.responseText);
            switch (http.status) {
                case 200:
                    openPopup(response["result"]);
                    setTimeout(() => {
                        window.location.assign(FRONT_VISITS_URL.replace("{username}", getUsernameFromJwt()));
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
