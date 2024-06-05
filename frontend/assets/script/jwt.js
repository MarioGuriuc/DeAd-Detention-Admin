//Author: Mario Guriuc

export function getUsernameFromJwt() {
    const jwt = localStorage.getItem("JWT");
    if (!jwt) {
        return null;
    }
    const json = JSON.parse(atob(jwt.split(".")[1]));
    return json.sub;
}

function isJwtExpired() {
    const jwt = localStorage.getItem("JWT");
    if (!jwt) {
        return true;
    }
    const json = JSON.parse(atob(jwt.split(".")[1]));
    return json.exp < Date.now() / 1000;
}

export function isLogged() {
    return !isJwtExpired();
}
