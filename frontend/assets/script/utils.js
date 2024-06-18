// Author: Mario Guriuc

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

export function setHeaders(http) {
    http.setRequestHeader('Content-Type', 'application/json');
    http.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("JWT"));
}

export function isAdmin() {
    const jwt = localStorage.getItem("JWT");
    if (jwt === null) return false;
    const payload = jwt.split(".")[1];
    const data = JSON.parse(atob(payload));
    return data["role"] === "admin";
}

export function extractCenterIdFromUrl() {
    const urlParts = window.location.pathname.split('/');
    return urlParts[2];
}

export function extractInmateIdFromUrl() {
    const url = window.location.href;
    const regex = /inmates\/([a-f0-9]{24})\/add-visit/;
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
