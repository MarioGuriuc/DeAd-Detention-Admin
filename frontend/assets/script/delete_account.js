// Author: Mario Guriuc

"use strict";

import {API_ACCOUNT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {openPopup} from "./popup.js";
import {getUsernameFromUrl, setHeaders} from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener('DOMContentLoaded', () => {
    handleNavbar("deleteAccount", true);
    document.getElementById("delete-account").addEventListener("click", deleteAccount);
});

function deleteAccount() {
    const http = new XMLHttpRequest();

    const url = API_ACCOUNT_URL.replace('{username}', getUsernameFromUrl());
    http.open('DELETE', url, true);
    const password = document.getElementById("password").value;
    const data = {
        password: password
    };
    setHeaders(http);

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            if (http.status === 200) {
                const response = JSON.parse(http.responseText);
                const result = response["result"];
                openPopup(result);
                setTimeout(() => {
                    window.location.assign("/");
                }, 1000);
            }
            else if (http.responseText === "") {
                openPopup("An error occurred. Please try again.");
            }
            else {
                const json = JSON.parse(http.responseText);
                const result = json["result"];
                openPopup(result);
            }
        }
    }

    http.send(JSON.stringify(data));
}
