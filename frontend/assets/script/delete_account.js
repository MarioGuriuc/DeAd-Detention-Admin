// Author: Mario Guriuc

import {API_ACCOUNT_URL, API_VERIFY_PASSWORD_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {getUsernameFromUrl, logout, setHeaders} from "./utils.js";

handleTogglePassword();

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener('DOMContentLoaded', () => {
    handleNavbar("deleteAccount", true);
    document.getElementById("delete-account").addEventListener("click", verifyPasswordAndDeleteAccount);
});

function deleteAccount() {
    const http = new XMLHttpRequest();
    const username = getUsernameFromUrl();
    const url = API_ACCOUNT_URL.replace("{username}", username);
    http.open('DELETE', url, true);

    setHeaders(http);

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            const response = http.responseText ? JSON.parse(http.responseText) : {};
            if (http.status === 200) {
                const result = response["result"] || "Account deleted successfully.";
                openPopup(result);
                setTimeout(() => {
                    window.location.assign("/");
                }, 1000);
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

function verifyPasswordAndDeleteAccount() {
    const http = new XMLHttpRequest();
    const password = document.getElementById("password").value;
    http.open('POST', API_VERIFY_PASSWORD_URL, true);

    setHeaders(http);

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            const response = http.responseText ? JSON.parse(http.responseText) : {};
            if (http.status === 200) {
                deleteAccount();
                logout();
            }
            else {
                const result = response["result"] || "An error occurred. Please try again.";
                openPopup(result);
                console.error(`Error: ${http.status} - ${http.statusText}`, response);
            }
        }
    };

    http.send(JSON.stringify({password: password}));
}
