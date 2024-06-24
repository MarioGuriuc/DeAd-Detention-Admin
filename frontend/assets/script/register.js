//Author: Mario Guriuc

import {API_REGISTER_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {getHeaders, isLogged} from "./utils.js";

handleTogglePassword();

document.addEventListener("DOMContentLoaded", function () {
    isLogged((logged) => {
        if (logged) {
            window.location.assign("/");
        }
        else {
            handleNavbar("register", false).then(() => {
                document.getElementById("register-button").addEventListener("click", register);

                function register() {
                    fetch(API_REGISTER_URL, {
                        method: 'POST',
                        headers: getHeaders(),
                        credentials: 'include',
                        body: JSON.stringify({
                            firstName: document.getElementById("firstName").value,
                            lastName: document.getElementById("lastName").value,
                            username: document.getElementById("username").value,
                            email: document.getElementById("email").value,
                            password: document.getElementById("password").value,
                            confirmPassword: document.getElementById("confirmPassword").value,
                            phone: document.getElementById("phone").value,
                            dob: document.getElementById("dob").value
                        })
                    })
                        .then((response) => {
                            if (response.status === 201) {
                                setTimeout(() => {
                                    window.location.assign('/login');
                                }, 1000);
                            }
                            return response.json();
                        })
                        .then(json => {
                            openPopup(json["result"]);
                        })
                        .catch(_ => {
                            openPopup("Unexpected error, please try again later.");
                        });
                }
            });
        }
    });
});
