// Author: Vlad

"use strict";

import {API_INMATES_COUNT_URL, API_INMATES_URL, FRONT_ADD_INMATE_URL, FRONT_ADD_VISIT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {extractCenterIdFromUrl, setHeaders} from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener('DOMContentLoaded', function () {
    handleNavbar("inmates", isLogged());
    const searchBar = document.getElementById('search');
    const inmatesContainer = document.querySelector('.inmates-container');
    const navigationButtons = document.querySelector('.navigation-buttons');

    let inmatesData = [];

    function renderInmates(data) {
        if (data.length === 0) {
            const noInmatesDiv = document.createElement('div');
            const inmatesContainer = document.querySelector('.inmates-container');
            inmatesContainer.style.justifyContent = 'center';
            noInmatesDiv.textContent = 'No inmates found';
            noInmatesDiv.classList.add('no-inmates');
            inmatesContainer.appendChild(noInmatesDiv);
        } else {
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
        const filteredInmates = inmatesData.filter(function (inmate) {
            return inmate.name.toLowerCase().includes(searchTerm.toLowerCase());
        });
        renderInmates(filteredInmates);
    }

    searchBar.addEventListener('input', function (event) {
        const searchTerm = event.target.value.trim();
        filterInmates(searchTerm);
    });

    function fetchInmates(pageNumber) {
        const http = new XMLHttpRequest();
        http.open('GET', API_INMATES_URL.replace('{page_number}', pageNumber).replace('{center_id}', extractCenterIdFromUrl), true);
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
                        createNavigationButtons(Math.ceil(count / 15));
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
                fetchInmates(i);
                history.pushState(null, null, '/inmates/p' + i);
                window.location.reload();
            });
            navigationButtons.appendChild(button);
        }
    }

    const pageNumber = window.location.href.split('/').pop().slice(1) || 1;
    fetchInmates(pageNumber);
    fetchInmatesCount();

    const centerId = extractCenterIdFromUrl();
    const addInmateButton = document.getElementById('add-inmate')
    addInmateButton.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.assign(FRONT_ADD_INMATE_URL.replace('{center_id}', centerId));
    });
});
