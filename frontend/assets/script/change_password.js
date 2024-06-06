// Author: Mario Guriuc

import {API_CHANGE_PASSWORD_URL, API_VERIFY_PASSWORD_URL, FRONT_ACCOUNT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {getUsernameFromUrl, setHeaders} from "./utils.js";

handleTogglePassword();

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", () => {
    handleNavbar("changePassword", true);
    const changePasswordButton = document.getElementById('change-password');
    changePasswordButton.addEventListener('click', changePassword);
});

function changePassword() {
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;

    const data = {
        oldPassword: oldPassword,
        newPassword: newPassword
    };

    console.log(data);

    submitChangePassword(data);
}

function verifyAndChangePassword() {
    const http = new XMLHttpRequest();
    const password = document.getElementById("password").value;
    http.open('POST', API_VERIFY_PASSWORD_URL, true);

    setHeaders(http);

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            const response = http.responseText ? JSON.parse(http.responseText) : {};
            if (http.status === 200) {
                changePassword();
            }
            else {
                const result = response["result"] || "An error occurred. Please try again.";
                openPopup(result);
                console.error(`Error: ${http.status} - ${http.statusText}`, response);
            }
        }
    };

    http.send();
}

function submitChangePassword(data) {
    const http = new XMLHttpRequest();
    const username = getUsernameFromUrl();
    const url = API_CHANGE_PASSWORD_URL.replace("{username}", username);
    http.open('POST', url, true);

    setHeaders(http);

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            const response = http.responseText ? JSON.parse(http.responseText) : {};
            if (http.status === 200) {
                openPopup("Password changed successfully.");
                setTimeout(() => {
                    window.location.assign(FRONT_ACCOUNT_URL.replace("{username}", username));
                }, 1000);
            }
            else {
                const result = response["result"] || "An error occurred. Please try again.";
                openPopup(result);
                console.error(`Error: ${http.status} - ${http.statusText}`, response);
            }
        }
    };

    http.send(JSON.stringify(data));
}
