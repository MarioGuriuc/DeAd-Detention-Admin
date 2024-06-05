//Author: Mario Guriuc

import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";

document.addEventListener('DOMContentLoaded', function () {
    handleNavbar("home", isLogged());
});
