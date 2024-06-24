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
            handleNavbar("deleteAccount", true).then(() => {
                document.getElementById("delete-account").addEventListener("click", deleteAccount);

                function deleteAccount() {
                    fetch(API_ACCOUNT_URL.replace("{username}", getUsernameFromUrl()), {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: getHeaders()
                    }).then((response) => {
                        if (response.status === 200) {
                            setTimeout(() => {
                                logout().then(() => {
                                    window.location.assign("/");
                                });
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
