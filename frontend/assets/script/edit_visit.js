"use strict";

import { API_EDIT_VISIT_URL, FRONT_VISITS_URL ,API_VISITS_URL} from "./constants.js";
import { handleNavbar } from "./handle_navbar.js";
import { isLogged, getUsernameFromJwt } from "./jwt.js";
import { extractVisitIdFromUrl } from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("visits", isLogged());
    loadVisitData();

    const submitButton = document.querySelector("button[type='submit']");
    submitButton.addEventListener("click", submitForm);
});

function loadVisitData() {
    const visitId = extractVisitIdFromUrl();
    const username = getUsernameFromJwt();
    const http = new XMLHttpRequest();
    http.open("GET", API_VISITS_URL.replace("{username}", username), true);

    http.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("JWT"));

    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            const visitsData = JSON.parse(http.responseText);
            const visitData = visitsData.visits.find(visit => visit.id === visitId);

            if (visitData) {
                document.getElementById("date").value = visitData.date;
                document.getElementById("time").value = visitData.time;
                document.getElementById("duration").value = visitData.duration;
                document.getElementById("nature").value = visitData.nature;
                document.getElementById("objects_exchanged").value = visitData.objects_exchanged;
                document.getElementById("summary").value = visitData.summary;
                document.getElementById("health").value = visitData.health;
                document.getElementById("witnesses").value = visitData.witnesses;
            } else {
                alert("Visit not found.");
            }
        }
    };

    http.send();
}

function submitForm(event) {
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
        alert("All fields are required.");
        return;
    }

    if (selectedDate <= currentDate) {
        alert("The date of the visit must be in the future.");
        return;
    }

    if (witnesses <= 0) {
        alert("The number of witnesses must be a positive number.");
        return;
    }

    if (duration <= 0) {
        alert("The duration must be a positive number.");
        return;
    }

    const formData = {
        date: date,
        time: time,
        duration: duration,
        nature: nature,
        objects_exchanged: objectsExchanged,
        summary: summary,
        health: health,
        witnesses: witnesses
    };

    editVisit(formData);
}

function editVisit(formData) {
    const http = new XMLHttpRequest();
    const visitId = extractVisitIdFromUrl();
    http.open("PUT", API_EDIT_VISIT_URL.replace("{visit_id}", visitId), true);

    http.setRequestHeader("Content-Type", "application/json");
    http.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("JWT"));

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            const response = JSON.parse(http.responseText);
            switch (http.status) {
                case 200:
                    alert("Visit updated successfully.");
                    setTimeout(() => {
                        window.location.assign(FRONT_VISITS_URL.replace("{username}", getUsernameFromJwt()));
                    }, 2000);
                    break;
                case 401:
                    alert("Unauthorized access. Please log in.");
                    break;
                default:
                    alert("Failed to update visit. Please try again later.");
            }
        }
    };

    http.send(JSON.stringify(formData));
}
