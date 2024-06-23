// Author: Mario Guriuc

import {API_VERIFY_JWT} from "./constants.js";

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

export function logout() {
    if (localStorage.getItem("JWT") !== null) {
        localStorage.removeItem("JWT");
        setTimeout(() => {
            window.location.assign("/");
        }, 1000);
    }
}

export function getHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("JWT")
    };
}

export function isAdmin() {
    const jwt = localStorage.getItem("JWT");
    if (jwt === null) return false;
    const payload = jwt.split(".")[1];
    const data = JSON.parse(atob(payload));
    return data["role"] === "admin";
}

export function isLogged(callback) {
    if (localStorage.getItem("JWT") === null) {
        callback(false);
        return;
    }

    fetch(API_VERIFY_JWT, {
        method: 'GET',
        headers: getHeaders()
    })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
            else {
                return null;
            }
        })
        .then(json => {
            if (json !== null) {
                localStorage.setItem("JWT", json["jwt"]);
                callback(true);
            }
            else {
                localStorage.removeItem("JWT");
                callback(false);
            }
        })
        .catch(_ => {
            localStorage.removeItem("JWT");
            window.location.assign("/");
            callback(false);
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
    } else {
        console.error("Inmate ID not found in the URL.");
        return null;
    }
}

export function extractVisitIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[4];
}
