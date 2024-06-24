// Author: Mario Guriuc

import {API_ACCOUNT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {getHeaders, getUsernameFromUrl, isLogged} from "./utils.js";

handleTogglePassword();

document.addEventListener('DOMContentLoaded', () => {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/");
        }
        else {
            handleNavbar("deleteAccount", true);
            document.getElementById("delete-account").addEventListener("click", deleteAccount);

            function deleteAccount() {
                fetch(API_ACCOUNT_URL.replace("{username}", getUsernameFromUrl()), {
                    method: 'DELETE',
                    headers: getHeaders()
                }).then((response) => {
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
        }
    });
});
