// Author: Mario Guriuc

import {API_CHANGE_ROLE_URL, FRONT_ACCOUNT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {openPopup} from "./popup.js";
import {getHeaders, getUsernameFromUrl, isAdmin, isLogged, logout} from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/");
        }
        else {
            if (!isAdmin()) {
                return window.location.assign(FRONT_ACCOUNT_URL.replace("{username}", getUsernameFromUrl()));
            }
            handleNavbar("changeRole", logged);
            document.getElementById('change-role').addEventListener('click', changeRole);

            function changeRole() {
                fetch(API_CHANGE_ROLE_URL.replace("{username}", getUsernameFromUrl()), {
                    'method': 'PATCH',
                    'headers': getHeaders(),
                    'body': JSON.stringify({
                        'username': document.getElementById('username').value,
                        'role': document.getElementById('role').value
                    })
                }).then((response) => {
                    switch (response["status"]) {
                        case 403:
                        case 405:
                            logout();
                            break;
                        default:
                            return response.json();
                    }
                }).then((json) => {
                    openPopup(json["result"]);
                }).catch(e => {
                    console.log(e);
                    openPopup("Unexpected error, please try again later.");
                })
            }
        }
    });
});
