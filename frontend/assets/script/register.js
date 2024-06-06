//Author: Mario Guriuc

import {API_REGISTER_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {setHeaders} from "./utils.js";

handleTogglePassword();

if (isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("register", false);
    document.getElementById("register-button").addEventListener("click", register);
});

function register() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;

    if (!firstName || !lastName || !username || !email || !password || !confirmPassword || !phone || !dob) {
        openPopup("Please fill in all fields");
    }
    else if (password !== confirmPassword) {
        openPopup("Passwords do not match");
    }
    else {
        const data = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            phone: phone,
            dob: dob
        };

        sendRegisterRequest(data);
    }
}

function sendRegisterRequest(data) {
    const http = new XMLHttpRequest();
    http.open('POST', API_REGISTER_URL, true);
    setHeaders(http);

    const json = JSON.stringify(data);

    http.onreadystatechange = function () {
        const response = JSON.parse(http.responseText);
        if (http.readyState === 4) {
            switch (http.status) {
                case 201:
                    openPopup(response["result"]);
                    setTimeout(() => {
                        window.location.assign("/login");
                    }, 2000);
                    break;
                default:
                    openPopup(response["result"]);
            }
        }
    };

    http.send(json);
}
