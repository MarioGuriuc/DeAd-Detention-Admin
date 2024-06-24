// Author: Mario Guriuc

import {
    API_ACCOUNT_URL,
    FRONT_ADMIN_URL,
    FRONT_CHANGE_PASSWORD_URL,
    FRONT_CHANGE_ROLE_URL,
    FRONT_DELETE_ACCOUNT_URL,
    FRONT_EDIT_ACCOUNT_URL
} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {getButton, getHeaders, getLogoutButton, getUsernameFromUrl, isLogged, logout} from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
    isLogged(logged => {
        if (!logged) {
            window.location.assign("/");
        }
        else {
            handleNavbar("account", logged)
                .then(() => {
                    function fetchUserInfo() {
                        fetch(API_ACCOUNT_URL.replace("{username}", getUsernameFromUrl()), {
                            'method': 'GET',
                            'headers': getHeaders(),
                            credentials: 'include',
                        }).then(response => {
                            if (!response.ok) {
                                logout().then(() => {
                                });
                            }
                            return response.json();
                        }).then(accountInfo => {
                            const accountInfoDiv = document.getElementById("account-info");
                            accountInfoDiv.id = 'account-info';

                            const accountInfoHeading = document.createElement('h2');
                            accountInfoHeading.textContent = 'Account Information';
                            accountInfoDiv.appendChild(accountInfoHeading);

                            const userInfo = {
                                "Username": accountInfo.username,
                                "Email": accountInfo.email,
                                "First Name": accountInfo.firstName,
                                "Last Name": accountInfo.lastName,
                                "Phone Number": accountInfo.phone,
                                "Role": accountInfo.role,
                                "Date of birth": accountInfo.dob
                            }

                            for (const [key, value] of Object.entries(userInfo)) {
                                const paragraph = document.createElement('p');
                                paragraph.textContent = `${key}: ${value}`;
                                accountInfoDiv.appendChild(paragraph);
                            }

                            appendButtons(accountInfo.role === "admin");
                        }).catch(_ => {
                            logout().then(_ => {
                            });
                        })
                    }

                    function appendButtons(isAdmin) {
                        const accountButtons = document.getElementById("account-buttons");
                        accountButtons.appendChild(getButton("Edit Account", FRONT_EDIT_ACCOUNT_URL.replace("{username}", getUsernameFromUrl())));
                        accountButtons.appendChild(getButton("Delete Account", FRONT_DELETE_ACCOUNT_URL.replace("{username}", getUsernameFromUrl())));
                        accountButtons.appendChild(getButton("Change Password", FRONT_CHANGE_PASSWORD_URL.replace("{username}", getUsernameFromUrl())));
                        if (isAdmin) {
                            accountButtons.appendChild(getButton("Admin Page", FRONT_ADMIN_URL.replace("{username}", getUsernameFromUrl())));
                            accountButtons.appendChild(getButton("Change User Role", FRONT_CHANGE_ROLE_URL.replace("{username}", getUsernameFromUrl())));
                        }
                        accountButtons.appendChild(getLogoutButton());
                    }

                    fetchUserInfo();
                });
        }
    });
});
