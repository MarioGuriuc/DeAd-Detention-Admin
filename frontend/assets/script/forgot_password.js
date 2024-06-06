// Author: Mario Guriuc

import {API_FORGOT_PASSWORD_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {setHeaders} from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("forgotPassword", false);
    document.getElementById("send-password").addEventListener("click", sendPassword);
});


function sendPassword() {
    const http = new XMLHttpRequest();
    const email = document.getElementById("email").value;

    if (email) {
        http.open("POST", API_FORGOT_PASSWORD_URL, true);
        setHeaders(http);

        const data = {
            email: email
        }

        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                const response = JSON.parse(http.responseText);
                switch (http.status) {
                    case 200:
                        openPopup(response['result']);
                        setTimeout(function () {
                            window.location.href = "/login";
                        }, 3000);
                        break;
                    default:
                        openPopup(response['result']);
                        break;
                }
            }
        }

        http.send(JSON.stringify(data));
    }
}
