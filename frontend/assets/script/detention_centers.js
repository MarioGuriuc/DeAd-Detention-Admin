//Author: Mario Guriuc

import {API_CENTERS_COUNT_URL, API_CENTERS_URL, FRONT_INMATES_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {isLogged} from "./jwt.js";
import {isAdmin, setHeaders} from "./utils.js";

if (!isLogged()) {
    window.location.assign("/");
}

document.addEventListener('DOMContentLoaded', function () {
    if (isAdmin()) {
        const addCenterDiv = document.createElement('div');
        addCenterDiv.classList.add('add-center');
        const addCenterLink = document.createElement('a');
        addCenterLink.setAttribute('href', '/add-center');
        const addCenterButton = document.createElement('button');
        addCenterButton.setAttribute('id', 'add-center-btn');
        addCenterButton.textContent = 'Add More Centers';
        addCenterLink.appendChild(addCenterButton);
        addCenterDiv.appendChild(addCenterLink);
        document.querySelector('.centers-wrapper').appendChild(addCenterDiv);
    }
    handleNavbar("centers", isLogged());
    const searchBar = document.getElementById('search');
    const centersContainer = document.querySelector('.centers');
    const navigationButtons = document.querySelector('.navigation-buttons');

    let centersData = [];

    function renderCenters(data) {
        if (data.length === 0) {
            const noCentersDiv = document.createElement('div');
            const centersWrapper = document.querySelector('.centers-wrapper');
            centersWrapper.style.justifyContent = 'center';
            noCentersDiv.textContent = 'No centers found';
            noCentersDiv.classList.add('no-centers');
            centersContainer.appendChild(noCentersDiv);
        }
        else {
            centersContainer.innerHTML = '';
            data.forEach(function (center) {
                const centerDiv = document.createElement('div');
                centerDiv.classList.add('center');

                const centerLink = document.createElement('a');

                const centerImg = document.createElement('img');
                centerImg.setAttribute('src', 'data:image/jpg;base64,' + center.image);
                centerImg.setAttribute('width', '200');
                centerImg.setAttribute('height', '150');
                centerImg.setAttribute('alt', center.name);

                const centerInfo = document.createElement('div');
                centerInfo.classList.add('center-info');

                const centerName = document.createElement('h3');
                centerName.textContent = center.title;

                const centerLocation = document.createElement('p');
                centerLocation.textContent = 'Location: ' + center.location;

                const centerDescription = document.createElement('p');
                centerDescription.textContent = 'Description: ' + center.description;

                centerLink.appendChild(centerImg);
                centerLink.appendChild(centerInfo);
                centerInfo.appendChild(centerName);
                centerInfo.appendChild(centerLocation);
                centerInfo.appendChild(centerDescription);
                centerDiv.appendChild(centerLink);
                centersContainer.appendChild(centerDiv);
                centerLink.setAttribute('href', FRONT_INMATES_URL.replace('{center_id}', center.id));
            });
        }
    }

    function filterCenters(searchTerm) {
        const filteredCenters = centersData.filter(function (center) {
            return center.title.toLowerCase().includes(searchTerm.toLowerCase());
        });
        renderCenters(filteredCenters);
    }

    searchBar.addEventListener('input', function (event) {
        const searchTerm = event.target.value.trim();
        filterCenters(searchTerm);
    });

    function fetchCenters(pageNumber) {
        const http = new XMLHttpRequest();
        http.open('GET', API_CENTERS_URL.replace('{page_number}', pageNumber), true);
        setHeaders(http);

        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                switch (http.status) {
                    case 200:
                        centersData = JSON.parse(http.responseText);
                        renderCenters(centersData);
                        break;
                    default:
                        window.location.assign("/login");
                }
            }
        };

        http.send();
    }

    function fetchCentersCount() {
        const http = new XMLHttpRequest();
        http.open('GET', API_CENTERS_COUNT_URL, true);
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
                fetchCenters(i);
                history.pushState(null, null, '/centers/p' + i);
            });
            navigationButtons.appendChild(button);
        }
    }

    const pageNumber = window.location.href.split('/').pop().slice(1) || 1;
    fetchCenters(pageNumber);
    fetchCentersCount();
});
