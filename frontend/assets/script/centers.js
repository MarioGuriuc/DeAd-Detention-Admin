// Author: Mario Guriuc

import {API_CENTERS_COUNT_URL, API_CENTERS_URL, FRONT_INMATES_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {getHeaders, isAdmin, isLogged} from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        }
        else {
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

            handleNavbar("centers", logged);

            const searchBar = document.getElementById('search');
            const centersContainer = document.querySelector('.centers');
            const navigationButtons = document.querySelector('.navigation-buttons');
            let centersData = [];

            function renderCenters(data) {
                centersContainer.innerHTML = '';
                if (data.length === 0) {
                    const noCentersDiv = document.createElement('div');
                    noCentersDiv.textContent = 'No centers found';
                    noCentersDiv.classList.add('no-centers');
                    centersContainer.appendChild(noCentersDiv);
                }
                else {
                    data.forEach(function (center) {
                        const centerDiv = document.createElement('div');
                        centerDiv.classList.add('center');

                        const centerLink = document.createElement('a');
                        centerLink.setAttribute('href', FRONT_INMATES_URL.replace('{center_id}', center.id));

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

                        centerInfo.appendChild(centerName);
                        centerInfo.appendChild(centerLocation);
                        centerInfo.appendChild(centerDescription);
                        centerLink.appendChild(centerImg);
                        centerLink.appendChild(centerInfo);
                        centerDiv.appendChild(centerLink);
                        centersContainer.appendChild(centerDiv);
                    });
                }
            }

            function filterCenters(searchTerm) {
                const filteredCenters = centersData.filter(function (center) {
                    return center.title.toLowerCase().includes(searchTerm.toLowerCase());
                });
                renderCenters(filteredCenters);
            }

            searchBar.addEventListener('input', (event) => {
                const searchTerm = event.target.value;
                filterCenters(searchTerm);
            });

            function fetchCenters(pageNumber) {
                fetch(API_CENTERS_URL.replace('{page_number}', pageNumber),
                    {
                        method: 'GET',
                        headers: getHeaders()
                    })
                    .then(response => {
                        if (!response.ok) {
                            window.location.assign("/login");
                        }
                        return response.json();
                    })
                    .then(data => {
                        centersData = data;
                        renderCenters(centersData);
                    })
                    .catch(_ => {
                        window.location.assign("/login");
                    });
            }

            function fetchCentersCount() {
                fetch(API_CENTERS_COUNT_URL, {
                    method: 'GET',
                    headers: getHeaders()
                })
                    .then(response => {
                        if (!response.ok) {
                            window.location.assign("/login");
                        }
                        return response.json();
                    })
                    .then(data => {
                        const pagesNumber = Math.ceil(data['count'] / 12);
                        createNavigationButtons(pagesNumber);
                    })
                    .catch(_ => {
                        window.location.assign("/login");
                    });
            }

            function createNavigationButtons(pagesNumber) {
                for (let i = 1; i <= pagesNumber; i++) {
                    const button = document.createElement('button');
                    button.textContent = i.toString();
                    button.addEventListener('click', () => {
                        fetchCenters(i);
                        history.pushState(null, null, '/centers/p' + i);
                        window.scrollTo({top: 0, behavior: 'smooth'});
                    });
                    navigationButtons.appendChild(button);
                }
            }

            const pageNumber = window.location.pathname.split('/').pop().replace('p', '');
            fetchCenters(parseInt(pageNumber));
            fetchCentersCount();
        }
    });
});
