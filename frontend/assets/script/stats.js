"use strict";

import {API_CENTERS_URL, API_INMATES_URL, API_STATISTICS_URL} from "./constants.js";
import {handleNavbar} from "./handle_navbar.js";
import {getHeaders, isLogged} from "./utils.js";

document.addEventListener("DOMContentLoaded", function () {
    isLogged((logged) => {
        if (!logged) {
            window.location.assign("/login");
        } else {
            handleNavbar("addVisit", logged);
            loadCenters();

            const generateStatsForm = document.querySelector("form");
            generateStatsForm.addEventListener("submit", function (event) {
                event.preventDefault();
                if (validateForm()) {
                    fetchStats();
                }
            });

            document.getElementById("downloadHTML").addEventListener("click", downloadHTML);
            document.getElementById("downloadCSV").addEventListener("click", downloadCSV);
            document.getElementById("downloadJSON").addEventListener("click", downloadJSON);

            const detentionCenterSelect = document.getElementById("detention-center");
            detentionCenterSelect.addEventListener("change", loadInmates);
        }
    });
});

function loadCenters() {
    fetch(API_CENTERS_URL, {
        method: 'GET',
        headers: getHeaders()
    })
        .then(response => response.json())
        .then(centers => {
            const centerSelect = document.getElementById("detention-center");
            centers.forEach(center => {
                const option = document.createElement("option");
                option.value = center.id;
                option.textContent = center.title;
                centerSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading centers:', error));
}

function loadInmates() {
    const centerId = document.getElementById("detention-center").value;
    if (centerId === "all") {
        clearInmates();
        return;
    }

    fetch(API_INMATES_URL.replace("{center_id}", centerId), {
        method: 'GET',
        headers: getHeaders()
    })
        .then(response => response.json())
        .then(inmates => {
            const inmatesSelect = document.getElementById("inmates");
            inmatesSelect.innerHTML = '<option value="all">All</option>';
            inmates.forEach(inmate => {
                const option = document.createElement("option");
                option.value = inmate.id;
                option.textContent = inmate.name;
                inmatesSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading inmates:', error));
}

function clearInmates() {
    const inmatesSelect = document.getElementById("inmates");
    inmatesSelect.innerHTML = '<option value="all">All</option>';
}

function validateForm() {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (new Date(startDate) > new Date(endDate)) {
        alert("Start Date cannot be later than End Date.");
        return false;
    }
    return true;
}

function fetchStats() {
    const centerId = document.getElementById("detention-center").value;
    const inmateId = document.getElementById("inmates").value;
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    fetch(API_STATISTICS_URL.replace("{center_id}", centerId)
        .replace("{inmate_id}", inmateId)
        .replace("{start_date}", startDate)
        .replace("{end_date}", endDate), {
        method: 'GET',
        headers: getHeaders()
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch statistics. Status code: ${response.status}`);
            }
            return response.json();
        })
        .then(stats => {
            window.statsData = stats;
            displayStats(stats);
        })
        .catch(error => {
            console.error("Failed to fetch statistics:", error);
            alert("Failed to fetch statistics. Please try again later.");
        });
}

function displayStats(stats) {
    const statsContainer = document.getElementById("stats-container");
    statsContainer.innerHTML = `
        <p>Visit Count: ${stats.visitCount}</p>
        <p>Total Duration: ${stats.totalDuration}</p>
        <p>Average Duration: ${stats.averageDuration.toFixed(2)}</p>
        <p>Total Witnesses: ${stats.totalWitnesses}</p>
        <p>Unique Creators Count: ${stats.uniqueCreatorsCount}</p>
        <p>Creators: ${stats.creators.join(', ')}</p>
    `;
}

function downloadHTML() {
    const stats = window.statsData;
    if (!stats) {
        alert("No stats to download.");
        return;
    }

    const htmlContent = `
        <html lang="en">
            <head><title>Stats Report</title></head>
            <body>
                <h1>Stats Report</h1>
                <p>Visit Count: ${stats.visitCount}</p>
                <p>Total Duration: ${stats.totalDuration}</p>
                <p>Average Duration: ${stats.averageDuration.toFixed(2)}</p>
                <p>Total Witnesses: ${stats.totalWitnesses}</p>
                <p>Unique Creators Count: ${stats.uniqueCreatorsCount}</p>
                <p>Creators: ${stats.creators.join(', ')}</p>
            </body>
        </html>
    `;

    const blob = new Blob([htmlContent], {type: "text/html"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "stats_report.html";
    link.click();
}

function downloadCSV() {
    const stats = window.statsData;
    if (!stats) {
        alert("No stats to download.");
        return;
    }

    const csvContent = generateCSVContent(stats);
    const blob = new Blob([csvContent], {type: "text/csv"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "stats_report.csv";
    link.click();
}

function generateCSVContent(stats) {
    const headers = ["Visit Count", "Total Duration", "Average Duration", "Total Witnesses", "Unique Creators Count", "Creators"];
    const csvRows = [headers.join(",")];

    const row = [
        stats.visitCount,
        stats.totalDuration,
        stats.averageDuration.toFixed(2),
        stats.totalWitnesses,
        stats.uniqueCreatorsCount,
        stats.creators.join('; ')
    ];
    csvRows.push(row.join(","));

    return csvRows.join("\n");
}

function downloadJSON() {
    const stats = window.statsData;
    if (!stats) {
        alert("No stats to download.");
        return;
    }

    const jsonContent = JSON.stringify(stats, null, 2);
    const blob = new Blob([jsonContent], {type: "application/json"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "stats_report.json";
    link.click();
}
