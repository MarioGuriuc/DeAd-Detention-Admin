// Author: Vlad

import {
    API_DELETE_INMATE_URL,
    API_INMATES_COUNT_URL,
    API_INMATES_URL, API_ONE_CENTER_URL,
    FRONT_ADD_INMATE_URL,
    FRONT_ADD_VISIT_URL,
    FRONT_EDIT_INMATE_URL,
    FRONT_INMATES_URL,
    FRONT_TRANSFER_INMATE_URL
} from "./constants.js";

import {handleNavbar} from "./handle_navbar.js";
import {extractCenterIdFromUrl, getHeaders, isAdmin, isLogged} from "./utils.js";

document.addEventListener('DOMContentLoaded', () => {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        }
        else {
            handleNavbar("inmates", logged).then(() => {
                const searchBar = document.getElementById('search');
                let inmatesData = [];

                function renderInmates(data) {
                    const inmatesContainer = document.querySelector('.inmates-wrapper');
                    inmatesContainer.innerHTML = '';

                    if (data.length === 0) {
                        const noInmatesDiv = document.createElement('div');
                        noInmatesDiv.textContent = 'No inmates found';
                        noInmatesDiv.classList.add('no-inmates');
                        inmatesContainer.appendChild(noInmatesDiv);
                    }
                    else {
                        data.forEach(function (inmate) {
                            const inmateDiv = document.createElement('div');
                            inmateDiv.classList.add('inmate');

                            const inmateLink = document.createElement('a');
                            inmateLink.setAttribute('href', FRONT_ADD_VISIT_URL.replace('{inmate_id}', inmate.id)
                                .replace('{center_id}', extractCenterIdFromUrl()));

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
                            inmateCrime.textContent = 'Crime: ' + inmate.crimes.join(', ');

                            const inmateSentence = document.createElement('p');
                            inmateSentence.textContent = 'Sentence: ' + inmate.sentences.join(', ');

                            isAdmin(admin => {
                                if (admin) {
                                    const buttonContainer = document.createElement('div');
                                    buttonContainer.classList.add('button-container');

                                    const deleteButton = document.createElement('button');
                                    deleteButton.textContent = 'Delete';
                                    deleteButton.classList.add('delete-button');
                                    deleteButton.addEventListener('click', function () {
                                        if (confirm('Are you sure you want to delete this inmate?')) {
                                            deleteInmate(inmate.id);
                                        }
                                    });

                                    const transferButton = document.createElement('button');
                                    transferButton.textContent = 'Transfer';
                                    transferButton.classList.add('transfer-button');
                                    transferButton.addEventListener('click', function () {
                                        window.location.assign(FRONT_TRANSFER_INMATE_URL.replace('{inmate_id}', inmate.id)
                                            .replace('{center_id}', extractCenterIdFromUrl()));
                                    });

                                    const editButton = document.createElement('button');
                                    editButton.textContent = 'Edit';
                                    editButton.classList.add('edit-button');
                                    editButton.addEventListener('click', function () {
                                        window.location.assign(FRONT_EDIT_INMATE_URL.replace('{inmate_id}', inmate.id)
                                            .replace('{center_id}', extractCenterIdFromUrl()));
                                    });

                                    buttonContainer.appendChild(deleteButton);
                                    buttonContainer.appendChild(transferButton);
                                    buttonContainer.appendChild(editButton);
                                    inmateDiv.appendChild(buttonContainer);
                                }
                            });

                            inmateLink.appendChild(inmateImg);
                            inmateInfo.appendChild(inmateName);
                            inmateInfo.appendChild(inmateCrime);
                            inmateInfo.appendChild(inmateSentence);
                            inmateDiv.appendChild(inmateLink);
                            inmateDiv.appendChild(inmateInfo);
                            inmatesContainer.appendChild(inmateDiv);
                        });
                    }
                }


                function deleteInmate(inmateId) {
                    fetch(API_DELETE_INMATE_URL.replace('{inmate_id}', inmateId).replace("{center_id}", extractCenterIdFromUrl()), {
                        method: 'DELETE',
                        headers: getHeaders(),
                        credentials: 'include',
                    })
                        .then(response => response.json())
                        .then(data => {
                            alert(data['result']);
                            fetchInmates();
                        })
                        .catch(error => {
                            alert('An error occurred: ' + error.message);
                        });
                }

                function filterInmates(searchTerm) {
                    const filteredInmates = inmatesData.filter(inmate => {
                        return inmate.name.toLowerCase().includes(searchTerm.toLowerCase());
                    });
                    renderInmates(filteredInmates);
                }

                searchBar.addEventListener('input', function (event) {
                    const searchTerm = event.target.value.trim();
                    filterInmates(searchTerm);
                });

                function fetchInmates(page = 1) {
                    fetch(API_INMATES_URL.replace('{center_id}', extractCenterIdFromUrl()), {
                        method: 'GET',
                        headers: getHeaders(),
                        credentials: 'include',
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            inmatesData = data;
                            renderInmates(inmatesData);
                        })
                        .catch(_ => {
                            alert('You are not authorized to view this page');
                            window.location.assign("/login");
                        });
                }

                function fetchInmatesCount() {
                    fetch(API_INMATES_COUNT_URL.replace('{center_id}', extractCenterIdFromUrl()), {
                        method: 'GET',
                        headers: getHeaders(),
                        credentials: 'include',
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const pagesNumber = Math.ceil(data.count / 10);
                            createNavigationButtons(pagesNumber);
                        })
                        .catch(_ => {
                            window.location.assign("/login");
                        });
                }

                function createNavigationButtons(pagesNumber) {
                    const navigationButtons = document.querySelector('.navigation-buttons');
                    navigationButtons.innerHTML = '';

                    for (let i = 1; i <= pagesNumber; i++) {
                        const button = document.createElement('button');
                        button.textContent = i.toString();
                        button.addEventListener('click', () => {
                            history.pushState(null, null, `${FRONT_INMATES_URL.replace('{center_id}', extractCenterIdFromUrl())}/p${i}`);
                            fetchInmates(i);
                        });
                        //navigationButtons.appendChild(button);
                    }
                }

                function fetchCenterDetails() {
                    fetch(API_ONE_CENTER_URL.replace("{center_id}", extractCenterIdFromUrl()), {
                        method: 'GET',
                        headers: getHeaders(),
                        credentials: 'include',
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.center) {
                                const centerNameBox = document.createElement('div');
                                centerNameBox.classList.add('center-name-box');
                                centerNameBox.textContent = `${data.center.title}`;
                                searchBar.insertAdjacentElement('afterend', centerNameBox);
                            }
                            else {
                                console.error("Center not found");
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching center details:', error);
                            console.error("Failed to fetch center details");
                        });
                }

                isAdmin(admin => {
                    if (admin) {
                        const addInmateDiv = document.createElement('div');
                        addInmateDiv.classList.add('add-inmate');
                        const addInmateLink = document.createElement('a');
                        addInmateLink.addEventListener('click', () => {
                            window.location.assign(FRONT_ADD_INMATE_URL.replace('{center_id}', extractCenterIdFromUrl()));
                        });
                        const addInmateButton = document.createElement('button');
                        addInmateButton.setAttribute('id', 'add-inmate-btn');
                        addInmateButton.textContent = 'Add More Inmates';
                        addInmateLink.appendChild(addInmateButton);
                        addInmateDiv.appendChild(addInmateLink);
                        document.querySelector('.main-content').appendChild(addInmateDiv);
                    }

                    const pageNumber = parseInt(window.location.href.split('/').pop().slice(1)) || 1;
                    fetchCenterDetails();
                    fetchInmatesCount();
                    fetchInmates();
                });
            });
        }
    });
});
