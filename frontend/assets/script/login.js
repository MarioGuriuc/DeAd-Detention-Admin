//Author: Mario Guriuc

import {API_LOGIN_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {setHeaders} from "./utils.js";

handleTogglePassword();

if (isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", () => {
    handleNavbar("login", false);
    document.getElementById("login-button").addEventListener("click", login);
});

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    if (username && password) {
        const data = {
            username: username,
            password: password,
            rememberMe: rememberMe
        };

        sendLoginRequest(data);
    }
}

function sendLoginRequest(data) {
    const http = new XMLHttpRequest();

    http.open('POST', API_LOGIN_URL, true);

    setHeaders(http);

    const json = JSON.stringify(data);

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.responseText === "") {
                openPopup("An error occurred. Please try again.");
            }
            else {
                const response = JSON.parse(http.responseText);
                const result = response["result"];
                switch (http.status) {
                    case 405:
                    case 409:
                        window.location.assign("/");
                        break;
                    case 200:
                        const jwt = response["jwt"];
                        localStorage.setItem("JWT", jwt);
                        openPopup(result);
                        setTimeout(() => {
                            window.location.assign("/centers");
                        }, 1000);
                        break;
                    default:
                        openPopup(result);
                }
            }
        }
    }

    http.send(json);
}
