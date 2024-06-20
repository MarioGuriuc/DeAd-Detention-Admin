
"use strict";

import {FRONT_ADD_CENTER_URL, FRONT_ADD_INMATE_ADMIN_URL, FRONT_STATISTICS_URL, FRONT_VISITS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged, getUsernameFromJwt} from "./jwt.js";
import {} from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("addVisit", isLogged());

    const addCentersButton = document.querySelector(".center-btn");
    const addInmatesButton = document.querySelector(".inmate-btn");
    const approveVisitsButton = document.querySelector(".visit-btn");
    const statisticsButton = document.querySelector(".stats-btn");

    addCentersButton.addEventListener("click", function () {
        window.location.assign(FRONT_ADD_CENTER_URL);
    });

    addInmatesButton.addEventListener("click", function () {
        window.location.assign(FRONT_ADD_INMATE_ADMIN_URL);
    });

    approveVisitsButton.addEventListener("click", function () {
        window.location.assign(FRONT_VISITS_URL.replace("{username}", getUsernameFromJwt()));
    });

    statisticsButton.addEventListener("click", function () {
        window.location.assign(FRONT_STATISTICS_URL);
    });
});