// Author: Vlad

"use strict";

import {API_VISIT_STATUS_URL, API_VISITS_URL, FRONT_EDIT_VISIT_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {getHeaders, getUsernameFromJwt, isAdmin, isLogged} from "./utils.js";

document.addEventListener('DOMContentLoaded', function () {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        }
        else {
            handleNavbar("visits", logged).then(async () => {
                const searchBar = document.getElementById('search');
                document.querySelector('.visits-container').addEventListener('click', function (event) {
                    if (event.target && event.target.classList.contains('edit-btn')) {
                        const visitId = event.target.dataset.id;
                        handleEdit(visitId);
                    }
                });

                let visitsData = [];

                function renderVisits(data) {
                    const visitsContainer = document.querySelector('.visits-container');

                    if (data["visits"].length === 0) {
                        const noVisitsDiv = document.createElement('div');
                        visitsContainer.style.justifyContent = 'center';
                        noVisitsDiv.textContent = 'No visits found';
                        noVisitsDiv.classList.add('no-visits');
                        visitsContainer.appendChild(noVisitsDiv);
                    }
                    else {
                        visitsContainer.innerHTML = '';
                        data["visits"].forEach(function (visit) {
                            const visitDiv = document.createElement('div');
                            visitDiv.classList.add('visit-entry');

                            const editButton = document.createElement('button');
                            editButton.textContent = 'Edit Visit';
                            editButton.classList.add('edit-btn');
                            editButton.dataset.id = visit.id;
                            visitDiv.appendChild(editButton);

                            const truncatedLength = 20;

                            const createTextElement = (label, text) => {
                                const p = document.createElement('p');
                                p.classList.add('text-wrap');

                                const span = document.createElement('span');
                                span.textContent = `${label}: `;

                                const fullText = document.createElement('span');
                                fullText.textContent = text;
                                fullText.style.display = 'none';

                                p.appendChild(span);

                                if (text.length > truncatedLength) {
                                    const readMoreButton = document.createElement('button');
                                    readMoreButton.textContent = 'Read More';
                                    readMoreButton.classList.add('read-more-btn');
                                    readMoreButton.addEventListener('click', () => {
                                        fullText.style.display = 'inline';
                                        readMoreButton.style.display = 'none';
                                        readLessButton.style.display = 'inline';
                                    });

                                    const readLessButton = document.createElement('button');
                                    readLessButton.textContent = 'Read Less';
                                    readLessButton.style.display = 'none';
                                    readLessButton.classList.add('read-less-btn');
                                    readLessButton.addEventListener('click', () => {
                                        fullText.style.display = 'none';
                                        readMoreButton.style.display = 'inline';
                                        readLessButton.style.display = 'none';
                                    });

                                    p.appendChild(readMoreButton);
                                    p.appendChild(readLessButton);
                                }
                                else {
                                    fullText.style.display = 'inline';
                                }

                                p.appendChild(fullText);
                                return p;
                            };

                            visitDiv.innerHTML += `
                                <h3>Date: ${visit.date}</h3>
                                <p>Detention Center: ${visit.center.name}</p>
                                <p>Inmate: ${visit.inmate.fullName}</p>
                                <p>Time: ${visit.time}</p>
                                <p>Duration: ${visit.duration} hours</p>
                            `;

                            visitDiv.appendChild(createTextElement('Nature', visit.nature));
                            visitDiv.appendChild(createTextElement('Objects Exchanged', visit.objectsExchanged));
                            visitDiv.appendChild(createTextElement('Summary', visit.summary));
                            visitDiv.appendChild(createTextElement('Health and Mood', visit.health));
                            visitDiv.appendChild(createTextElement('Witnesses', visit.witnesses));
                            isAdmin(admin => {
                                if (visit.status === 'pending' && admin) {
                                    const statusButton = document.createElement('button');
                                    statusButton.classList.add(`${visit.status}-btn`);
                                    statusButton.textContent = visit.status.charAt(0).toUpperCase() + visit.status.slice(1);
                                    visitDiv.appendChild(statusButton);
                                }
                                if (visit.status === 'pending' && !admin) {
                                    const statusButton = document.createElement('button');
                                    statusButton.classList.add(`${visit.status}-btn`);
                                    statusButton.textContent = visit.status.charAt(0).toUpperCase() + visit.status.slice(1);
                                    visitDiv.appendChild(statusButton);
                                }
                                if (visit.status === 'pending' && admin) {
                                    const buttonsDiv = document.createElement('div');
                                    buttonsDiv.classList.add('approve-deny-buttons');

                                    const approveButton = document.createElement('button');
                                    approveButton.classList.add('approve-btn');
                                    approveButton.textContent = 'Approve';
                                    approveButton.dataset.id = visit.id;
                                    approveButton.addEventListener('click', () => handleApproval(visit.id, 'approved'));

                                    const denyButton = document.createElement('button');
                                    denyButton.classList.add('deny-btn');
                                    denyButton.textContent = 'Deny';
                                    denyButton.dataset.id = visit.id;
                                    denyButton.addEventListener('click', () => handleApproval(visit.id, 'denied'));

                                    buttonsDiv.appendChild(approveButton);
                                    buttonsDiv.appendChild(denyButton);

                                    visitDiv.appendChild(buttonsDiv);
                                }

                                if (visit.status === 'approved' || visit.status === 'denied') {
                                    const statusButton = document.createElement('button');
                                    statusButton.classList.add(`${visit.status}-btn`);
                                    statusButton.textContent = visit.status.charAt(0).toUpperCase() + visit.status.slice(1);
                                    if (admin)
                                        statusButton.addEventListener('click', () => handleApproval(visit.id, 'attended'));
                                    visitDiv.appendChild(statusButton);
                                }

                                if (visit.status === 'attended' || visit.status === 'expired') {
                                    const statusButton = document.createElement('button');
                                    statusButton.classList.add(`${visit.status}-btn`);
                                    statusButton.textContent = visit.status.charAt(0).toUpperCase() + visit.status.slice(1);
                                    visitDiv.appendChild(statusButton);
                                }
                            });

                            visitsContainer.appendChild(visitDiv);
                        });
                    }
                }

                function filterVisits(searchTerm) {
                    const filteredVisits = visitsData.visits.filter(visit => {
                        return visit.inmate.fullName.toLowerCase().includes(searchTerm.toLowerCase());
                    });
                    const searchedVisits = JSON.parse(JSON.stringify({visits: filteredVisits}));
                    if (searchedVisits.visits.length > 0) {
                        {
                            renderVisits(searchedVisits);
                        }
                    }
                }

                searchBar.addEventListener('input', function (event) {
                    const searchTerm = event.target.value.trim();
                    filterVisits(searchTerm);
                });

                function handleEdit(visitId) {
                    const username = getUsernameFromJwt();
                    window.location.assign(FRONT_EDIT_VISIT_URL.replace('{username}', username).replace('{visit_id}', visitId));
                }

                async function fetchVisits() {
                    const url = API_VISITS_URL.replace('{username}', await getUsernameFromJwt());

                    fetch(url, {
                        method: 'GET',
                        headers: getHeaders(),
                        credentials: 'include'
                    })
                        .then(response => response.json()
                            .then(data => ({status: response.status, body: data}))
                            .catch(() => ({status: response.status, body: {}})))
                        .then(({status, body}) => {
                            if (status === 200) {
                                visitsData = body;
                                renderVisits(body);
                            }
                            else {
                                window.location.assign("/login");
                            }
                        })
                        .catch(_ => {
                            window.location.assign("/login");
                        });
                }


                function handleApproval(visitId, status) {
                    const url = API_VISIT_STATUS_URL.replace('{visit_id}', visitId);

                    fetch(url, {
                        method: 'PATCH',
                        headers: getHeaders(),
                        credentials: 'include',
                        body: JSON.stringify({status})
                    })
                        .then(response => response.json()
                            .then(data => ({status: response.status, body: data}))
                            .catch(() => ({status: response.status, body: {}})))
                        .then(({status, body}) => {
                            if (status === 200) {
                                if (body.result === "Visit status updated successfully") {
                                    fetchVisits();
                                }
                                else {
                                    alert(`Failed to handle the approval the visit.`);
                                }
                            }
                        })
                        .catch(_ => {
                            alert(`Error ${status} the visit. Please try again later.`);
                        });
                }

                await fetchVisits();
            });
        }
    });
});
