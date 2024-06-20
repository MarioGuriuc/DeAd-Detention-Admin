// Author: Mario Guriuc

import {API_ACCOUNT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {getHeaders, getUsernameFromUrl, isLogged, logout} from "./utils.js";

handleTogglePassword();

document.addEventListener('DOMContentLoaded', () => {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/");
        }
        else {
            handleNavbar("editAccount", logged);
            document.getElementById("save-button").addEventListener("click", editAccount);

            function editAccount() {
                fetch(API_ACCOUNT_URL.replace("{username}", getUsernameFromUrl()), {
                    method: 'PATCH',
                    headers: getHeaders(),
                    body: JSON.stringify({
                        firstName: document.getElementById("firstName").value,
                        lastName: document.getElementById("lastName").value,
                        email: document.getElementById("email").value,
                        phone: document.getElementById("phone").value,
                        dob: document.getElementById("dob").value
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
                        logout();
                    })
                    .catch(_ => {
                        openPopup("Unexpected error, please try again later.");
                    });
            }
        }
    });
});
