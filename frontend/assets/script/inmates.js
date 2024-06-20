// Author: Vlad

"use strict";

import {
    API_INMATES_COUNT_URL,
    API_INMATES_URL,
    FRONT_ADD_INMATE_URL,
    FRONT_ADD_VISIT_URL,
    FRONT_INMATES_URL
} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {extractCenterIdFromUrl, isAdmin, setHeaders} from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener('DOMContentLoaded', function () {
    handleNavbar("inmates", isLogged());
    const searchBar = document.getElementById('search');

    let inmatesData = [];

    function renderInmates(data) {
        if (data.length === 0) {
            const noInmatesDiv = document.createElement('div');
            const inmatesContainer = document.querySelector('.inmates-wrapper');
            inmatesContainer.style.justifyContent = 'center';
            noInmatesDiv.textContent = 'No inmates found';
            noInmatesDiv.classList.add('no-inmates');
            inmatesContainer.appendChild(noInmatesDiv);
        } else {
            const inmatesContainer = document.querySelector('.inmates-wrapper');
            inmatesContainer.innerHTML = '';
            data.forEach(function (inmate) {
                const inmateDiv = document.createElement('div');
                inmateDiv.classList.add('inmate');

                const inmateLink = document.createElement('a');

                const inmateImg = document.createElement('img');
                inmateImg.setAttribute('src', 'data:image/jpg;base64,' + inmate.image);
                inmateImg.setAttribute('width', '200');
                inmateImg.setAttribute('height', '150');
                inmateImg.setAttribute('alt', inmate.name);

                const inmateInfo = document.createElement('div');
                inmateInfo.classList.add('inmate-info');

                const inmateName = document.createElement('h3');
                inmateName.textContent = inmate.name;

                const inmateCrime = document.createElement('p');
                inmateCrime.textContent = 'Crime: ' + inmate.crime;

                const inmateSentence = document.createElement('p');
                inmateSentence.textContent = 'Sentence: ' + inmate.sentence;

                inmateLink.appendChild(inmateImg);
                inmateLink.appendChild(inmateInfo);
                inmateInfo.appendChild(inmateName);
                inmateInfo.appendChild(inmateCrime);
                inmateInfo.appendChild(inmateSentence);
                inmateDiv.appendChild(inmateLink);
                inmatesContainer.appendChild(inmateDiv);
                inmateLink.setAttribute('href', FRONT_ADD_VISIT_URL.replace('{inmate_id}',inmate.id)
                    .replace('{center_id}', extractCenterIdFromUrl));
            });
        }
    }

    function filterInmates(searchTerm) {
        const filteredInmates = inmatesData.filter(inmate => {
            return inmate.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
        if (filteredInmates.length > 0) {
            renderInmates(filteredInmates);
        }
    }

    searchBar.addEventListener('input', function (event) {
        const searchTerm = event.target.value.trim();
        filterInmates(searchTerm);
    });

    function fetchInmates(pageNumber) {
        const http = new XMLHttpRequest();
        http.open('GET', API_INMATES_URL.replace('{center_id}', extractCenterIdFromUrl), true);
        setHeaders(http);

        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                switch (http.status) {
                    case 200:
                        inmatesData = JSON.parse(http.responseText);
                        renderInmates(inmatesData);
                        break;
                    default:
                        window.location.assign("/login");
                }
            }
        };

        http.send();
    }

    function fetchInmatesCount() {
        const http = new XMLHttpRequest();
        http.open('GET', API_INMATES_COUNT_URL.replace('{center_id}', extractCenterIdFromUrl), true);
        setHeaders(http);

        let count = 0;

        http.onreadystatechange = () => {
            if (http.readyState === 4) {
                switch (http.status) {
                    case 200:
                        count = JSON.parse(http.responseText).count;
                        createNavigationButtons(Math.ceil(count / 10));
                        break;
                    case 401:
                        window.location.assign("/login");
                }
            }
        };
        http.send();
    }

    function createNavigationButtons(pagesNumber) {
        for (let i = 1; i <= pagesNumber; i++) {
            const button = document.createElement('button');
            button.textContent = i.toString();
            button.addEventListener('click', () => {
                history.pushState(null, null, FRONT_INMATES_URL.replace('{center_id}',extractCenterIdFromUrl)+ '/p'+i);
                fetchInmates(i);
                window.location.reload();
            });
            //document.querySelector('.navigation-buttons').appendChild(button); FOR LATER USE FOR PAGINATION
        }
    }

    if (isAdmin()){
        const addInmateDiv = document.createElement('div');
        addInmateDiv.classList.add('add-center');
        const addInmateLink = document.createElement('a');
        addInmateLink.addEventListener('click', () => {
            window.location.assign(FRONT_ADD_INMATE_URL.replace('{center_id}', extractCenterIdFromUrl));
        });
        const addInmateButton = document.createElement('button');
        addInmateButton.setAttribute('id', 'add-inmate-btn');
        addInmateButton.textContent = 'Add More Inmates';
        addInmateLink.appendChild(addInmateButton);
        addInmateDiv.appendChild(addInmateLink);
        document.querySelector('.main-content').appendChild(addInmateDiv);
    }

    const pageNumber = window.location.href.split('/').pop().slice(1) || 1;
    fetchInmatesCount();
    fetchInmates(pageNumber);
});
