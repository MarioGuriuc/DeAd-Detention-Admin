// Author: Mario Guriuc

import {API_FORGOT_PASSWORD_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {getHeaders, isLogged} from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
    isLogged((logged) => {
        if (logged) {
            window.location.assign("/");
        }
        else {
            handleNavbar("forgotPassword", false);
            document.getElementById("send-password").addEventListener("click", sendPassword);
        }
    });
});

function sendPassword() {
    fetch(API_FORGOT_PASSWORD_URL, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
            email: document.getElementById("email").value
        })
    })
        .then((response) => {
            return response.json();
        })
        .then(json => {
            openPopup(json["result"]);
        })
        .catch(_ => {
            openPopup("Unexpected error, please try again later.");
        });
}
