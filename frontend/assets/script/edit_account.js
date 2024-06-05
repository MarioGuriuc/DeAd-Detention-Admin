import {API_ACCOUNT_URL, FRONT_ACCOUNT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {openPopup} from "./popup.js";
import {getUsernameFromUrl, setHeaders} from "./utils.js";

"use strict";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("account", true);
    const saveButton = document.getElementById("save-button");
    saveButton.addEventListener("click", saveChanges);
});

const firstName = document.getElementById("first-name").value;
const lastName = document.getElementById("last-name").value;
const username = document.getElementById("username").value;
const email = document.getElementById("email").value;
const phone = document.getElementById("phone").value;
const password = document.getElementById("password").value;
const confirmPassword = document.getElementById("confirm-password").value;

const data = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    email: email,
    phone: phone,
    password: password,
    confirmPassword: confirmPassword
};

const http = new XMLHttpRequest();

function saveChanges() {
    const url = API_ACCOUNT_URL.replace("{username}", getUsernameFromUrl());
    http.open("PATCH", url, true);
    setHeaders(http);

    http.onreadystatechange = function () {
        if (http.readyState === 4 && http.status === 200) {
            const response = JSON.parse(http.responseText);
            if (http.readyState === 4 && http.status === 200) {
                openPopup(response.message);
                window.location.href = FRONT_ACCOUNT_URL.replace("{username}", getUsernameFromUrl());
            }
            else {
                openPopup(response.message);
            }
        }
    }

    http.send(JSON.stringify(data));
}
