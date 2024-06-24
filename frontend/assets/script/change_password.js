// Author: Mario Guriuc

import {API_CHANGE_PASSWORD_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {getHeaders, getUsernameFromUrl, isLogged} from "./utils.js";

handleTogglePassword();

document.addEventListener("DOMContentLoaded", () => {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/");
        }
        else {
            handleNavbar("changePassword", true);
            document.getElementById("change-password").addEventListener("click", changePassword);

            function changePassword() {
                fetch(API_CHANGE_PASSWORD_URL, {
                    method: 'PATCH',
                    headers: getHeaders(),
                    body: JSON.stringify({
                        oldPassword: document.getElementById("oldPassword").value,
                        newPassword: document.getElementById("newPassword").value
                    })
                })
                    .then((response) => {
                        if (response.status === 200) {
                            setTimeout(() => {
                                window.location.assign('/account/' + getUsernameFromUrl());
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
