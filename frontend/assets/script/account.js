// Author: Mario Guriuc

import {
    API_ACCOUNT_URL,
    FRONT_ADMIN_URL,
    FRONT_CHANGE_PASSWORD_URL,
    FRONT_DELETE_ACCOUNT_URL,
    FRONT_EDIT_ACCOUNT_URL
} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {getButton, getUsernameFromUrl, logout, setHeaders} from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    fetchUserInfo();
});

function appendButtons(isAdmin) {
    const accountButtons = document.getElementById("account-buttons");
    accountButtons.appendChild(getButton("Edit Account", FRONT_EDIT_ACCOUNT_URL.replace("{username}", getUsernameFromUrl())));
    accountButtons.appendChild(getButton("Delete Account", FRONT_DELETE_ACCOUNT_URL.replace("{username}", getUsernameFromUrl())));
    accountButtons.appendChild(getButton("Change Password", FRONT_CHANGE_PASSWORD_URL.replace("{username}", getUsernameFromUrl())));
    accountButtons.appendChild(getButton("Logout", ""));
    accountButtons.lastChild.addEventListener("click", logout);
    if (isAdmin) {
        accountButtons.appendChild(getButton("Admin Page", FRONT_ADMIN_URL.replace("{username}", getUsernameFromUrl())));
    }
}

function fetchUserInfo() {
    const http = new XMLHttpRequest();
    const username = getUsernameFromUrl();
    const url = API_ACCOUNT_URL.replace("{username}", username);
    http.open('GET', url, true);

    setHeaders(http);

    http.onreadystatechange = () => {
        if (http.readyState === 4) {
            switch (http.status) {
                case 200:
                    const accountInfo = JSON.parse(http.responseText);
                    const accountInfoDiv = document.getElementById('account-info');

                    const accountInfoHeading = document.createElement('h2');
                    accountInfoHeading.textContent = 'Account Information';
                    accountInfoDiv.appendChild(accountInfoHeading);

                    const userInfo = [
                        {label: 'Username', value: accountInfo.username},
                        {label: 'Email', value: accountInfo.email},
                        {label: 'First Name', value: accountInfo.firstName},
                        {label: 'Last Name', value: accountInfo.lastName},
                        {label: 'Phone Number', value: accountInfo.phone},
                        {label: 'Role', value: accountInfo.role},
                        {label: 'Date of birth', value: accountInfo.dob}
                    ];

                    userInfo.forEach(info => {
                        const paragraph = document.createElement('p');
                        paragraph.textContent = `${info.label}: ${info.value}`;
                        accountInfoDiv.appendChild(paragraph);
                    });
                    handleNavbar("account", true);
                    appendButtons(accountInfo.role === "admin");
                    break;
                default:
                    logout();
                    window.location.assign("/");
                    break;
            }
        }
    }

    http.send();
}
