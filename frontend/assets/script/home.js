//Author: Mario Guriuc

import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./utils.js";

document.addEventListener('DOMContentLoaded', function () {
    isLogged(logged => {
        handleNavbar("home", logged)
            .then(() => {
                if (!logged) {
                    const welcomeSection = document.getElementById("welcome-section");
                    const loginOrRegister = document.createElement("p");
                    loginOrRegister.textContent = "Login/Register for getting access to our features.";
                    welcomeSection.appendChild(loginOrRegister);
                }
            });
    });
});
