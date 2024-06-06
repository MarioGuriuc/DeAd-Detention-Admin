import {API_ACCOUNT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {openPopup} from "./popup.js";
import {handleTogglePassword} from "./toggle_password.js";
import {getUsernameFromUrl, logout, setHeaders} from "./utils.js";

handleTogglePassword();

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener("DOMContentLoaded", function () {
    handleNavbar("editAccount", true);
    const saveButton = document.getElementById("save-button");
    saveButton.addEventListener("click", saveChanges);
});

const http = new XMLHttpRequest();

function saveChanges() {
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const data = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        phone: phone,
        password: password,
        confirmPassword: confirmPassword
    };

    const url = API_ACCOUNT_URL.replace("{username}", getUsernameFromUrl());
    http.open("PATCH", url, true);
    setHeaders(http);

    http.onreadystatechange = function () {
        if (http.readyState === 4) {
            if (http.responseText === "") {
                openPopup("Unexpected error, please try again later.");
                return;
            }
            const response = JSON.parse(http.responseText);
            if (http.status === 200) {
                openPopup(response["result"]);
                logout();
                setTimeout(() => {
                    window.location.assign('/login');
                }, 1000);
            }
            else {
                openPopup(response["result"]);
            }
        }
    }

    http.send(JSON.stringify(data));
}
