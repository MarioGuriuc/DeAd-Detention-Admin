"use strict";

import {API_EDIT_VISIT_URL, API_VISITS_URL, FRONT_VISITS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {extractVisitIdFromUrl, getHeaders, getUsernameFromJwt, isLogged} from "./utils.js";


document.addEventListener("DOMContentLoaded", function () {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        }
        else {
            handleNavbar("visits", logged).then(async () => {
                await loadVisitData();

                const submitButton = document.getElementById("add-visit-btn");
                submitButton.addEventListener("click", submitEditedVisit);
            });
        }
    });
});

async function loadVisitData() {
    const visitId = extractVisitIdFromUrl();
    const username = await getUsernameFromJwt();
    const url = API_VISITS_URL.replace("{username}", username);

    fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
    })
        .then(response => response.json()
            .then(data => ({status: response.status, body: data}))
            .catch(() => ({status: response.status, body: {}})))
        .then(({status, body}) => {
            if (status === 200) {
                const visitData = body.visits.find(visit => visit.id === visitId);

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
                }
                else {
                    openPopup("Visit not found.");
                }
            }
            else {
                openPopup("Failed to load visit data.");
            }
        })
        .catch(_ => {
            openPopup("An error occurred while loading visit data.");
        });
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
    const visitId = extractVisitIdFromUrl();
    const url = API_EDIT_VISIT_URL.replace("{visit_id}", visitId);

    fetch(url, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(formData),
        credentials: 'include',
    })
        .then(response => response.json()
            .then(data => ({status: response.status, body: data}))
            .catch(() => ({status: response.status, body: {}})))
        .then(({status, body}) => {
            openPopup(body["result"]);
            if (status === 200) {
                setTimeout(async () => {
                    window.location.assign(FRONT_VISITS_URL.replace("{username}", await getUsernameFromJwt()));
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
            openPopup("An error occurred while editing the visit.");
        });
}
