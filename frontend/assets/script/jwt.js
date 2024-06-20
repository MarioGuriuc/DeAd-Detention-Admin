//Author: Mario Guriuc

export function getUsernameFromJwt() {
    const jwt = localStorage.getItem("JWT");
    if (!jwt) {
        return null;
    }
    const json = JSON.parse(atob(jwt.split(".")[1]));
    return json.sub;
}
