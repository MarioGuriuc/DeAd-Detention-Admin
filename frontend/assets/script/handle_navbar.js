// Author: Mario Guriuc and Vlad

import {FRONT_ACCOUNT_URL} from "./constants.js";
import {getUsernameFromJwt} from "./utils.js";

const accountRoute = async () => {
    const username = await getUsernameFromJwt();
    return FRONT_ACCOUNT_URL.replace("{username}", username);
}

export const handleNavbar = async (page, loggedIn = false) => {
    const headerContent = document.querySelector("header .header-content");
    const navBar = document.createElement("nav-bar");
    navBar.classList.add("nav-bar");
    headerContent.appendChild(navBar);

    if (loggedIn) {
        switch (page) {
            case "editAccount":
            case "deleteAccount":
            case "centers":
            case "changePassword": {
                await appendHomeAccountButtons(navBar);
                break;
            }
            case "changeRole":
            case "home":
            case "visits":
            case "addVisit":
            case "inmates": {
                await appendCentersAccountButtons(navBar);
                break;
            }
            case "addCenter":
            case "addInmate":
            case "account": {
                appendHomeCentersButtons(navBar);
                break;
            }
        }
    }
    else {
        switch (page) {
            case "forgotPassword":
            case "register":
            case "login": {
                appendHomeButton(navBar);
                break;
            }
            case "home": {
                appendLoginButton(navBar);
                break;
            }
        }
        appendRegisterButton(navBar);
    }
};

function getButton(text, route) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", function (event) {
        event.preventDefault();
        window.location.assign(route);
    });
    return button;
}

async function appendHomeAccountButtons(navBar) {
    navBar.appendChild(getButton("Home", "/"));
    navBar.appendChild(getButton("Account", await accountRoute()));
}

async function appendCentersAccountButtons(navBar) {
    navBar.appendChild(getButton("Centers", "/centers"));
    navBar.appendChild(getButton("Account", await accountRoute()));
}

function appendHomeCentersButtons(navBar) {
    navBar.appendChild(getButton("Home", "/"));
    navBar.appendChild(getButton("Centers", "/centers"));
}

function appendHomeButton(navBar) {
    navBar.appendChild(getButton("Home", "/"));
}

function appendLoginButton(navBar) {
    navBar.appendChild(getButton("Login", "/login"));
}

function appendRegisterButton(navBar) {
    navBar.appendChild(getButton("Register", "/register"));
}
