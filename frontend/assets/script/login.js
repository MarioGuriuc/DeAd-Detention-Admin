// Author: Mario Guriuc

import {API_LOGIN_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {getHeaders, isLogged} from "./utils.js";

handleTogglePassword();

document.addEventListener("DOMContentLoaded", () => {
    isLogged((logged) => {
        if (logged) {
            window.location.assign("/");
        }
        else {
            handleNavbar("login", logged);
            document.getElementById("login-button").addEventListener("click", login);

            function login() {
                fetch(API_LOGIN_URL, {
                    method: 'POST',
                    headers: getHeaders(),
                    credentials: 'include',
                    body: JSON.stringify({
                        username: document.getElementById("username").value,
                        password: document.getElementById("password").value
                    })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            setTimeout(() => {
                                window.location.assign('/centers');
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
        }
    });
});