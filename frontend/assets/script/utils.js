// Author: Mario Guriuc

import {API_GET_USERNAME, API_LOGOUT_URL, API_VERIFY_ADMIN, API_VERIFY_JWT} from "./constants.js";

export function getUsernameFromUrl() {
    const url = window.location.href;
    return url.match(/\/account\/([^/]+)/)[1];
}

export function getButton(text, route) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.assign(route);
    });
    return button;
}

export function getLogoutButton() {
    const button = document.createElement("button");
    button.textContent = "Logout";
    button.addEventListener("click", async (event) => {
        event.preventDefault();
        await logout();
        window.location.assign("/");
    });
    return button;
}

export async function logout() {
    await fetch(API_LOGOUT_URL, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    });
}

export function getHeaders() {
    return {
        'Content-Type': 'application/json'
    };
}

export function isAdmin(admin) {
    fetch(API_VERIFY_ADMIN, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    })
        .then(response => {
            return response.json();
        })
        .then(json => {
            admin(json["result"] === "Authorized");
        })
        .catch(_ => {
            admin(false);
        });
}

export function isLogged(logged) {
    fetch(API_VERIFY_JWT, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    })
        .then(response => {
            return response.json();
        })
        .then(json => {
            logged(json["result"] !== "Unauthorized");
        })
        .catch(_ => {
            window.location.assign("/");
            logged(false);
        });
}

export function extractCenterIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[2];
}

export function extractInmateIdFromUrl() {
    const url = window.location.href;
    const regex = /inmates\/([a-f0-9]{24})\/?/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    else {
        console.error("Inmate ID not found in the URL.");
        return null;
    }
}

export function extractVisitIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[4];
}

export async function getUsernameFromJwt() {
    return fetch(API_GET_USERNAME, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include'
    })
        .then(response => {
            return response.json();
        })
        .then(json => {
            return json["username"];
        })
        .catch(_ => {
            return null;
        });
}
