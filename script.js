let allLaunches = [];

async function fetchData() {
    try {
        const response = await fetch('https://services.isrostats.in/api/launches');
        if (!response.ok) {
            throw new Error('API Error ' + response.statusText);
        }
        allLaunches = await response.json(); 
        return allLaunches;
    } catch (error) {
        throw new Error(' ' + error.message);
    }
}

function displayData(data, container) {
    let row = document.createElement('div');
    row.className = 'row';

    data.forEach((launch, index) => {
        const launchElement = document.createElement('div');
        launchElement.className = 'launch-tile';
        launchElement.innerHTML = `
            <h3>${launch.Name || 'N/A'}</h3>
            <p>Date: ${launch.LaunchDate || 'N/A'}</p>
            <p>Vehicle: ${launch.LaunchType || 'N/A'}</p>
            <p>Payload: ${launch.Payload || 'N/A'}</p>
            <p>Launch Site: ${launch.SerialNumber || 'N/A'}</p>
            <p>Outcome: ${launch.MissionStatus || 'N/A'}</p>
            <p><a href="${launch.Link}" target="_blank">More Info</a></p>
        `;
        row.appendChild(launchElement);

        if ((index + 1) % 3 === 0) {
            container.appendChild(row);
            row = document.createElement('div');
            row.className = 'row';
        }
    });

    if (data.length % 3 !== 0) {
        container.appendChild(row);
    }
}

function performSearch() {
    const searchQuery = document.getElementById('search-input').value.trim().toLowerCase();
    const filteredLaunches = allLaunches.filter(launch =>
        launch.Name.toLowerCase().includes(searchQuery) ||
        launch.LaunchDate.toLowerCase().includes(searchQuery) ||
        launch.LaunchType.toLowerCase().includes(searchQuery) ||
        launch.Payload.toLowerCase().includes(searchQuery) ||
        launch.SerialNumber.toLowerCase().includes(searchQuery) ||
        launch.MissionStatus.toLowerCase().includes(searchQuery)
    );

    const statsContainer = document.getElementById('stats');
    statsContainer.innerHTML = '';

    displayData(filteredLaunches, statsContainer);
}

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('search-button').addEventListener('click', performSearch);
document.getElementById('search-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    const statsContainer = document.getElementById('stats');
    try {
        const data = await fetchData();
        displayData(data, statsContainer);
    } catch (error) {
        document.getElementById('error-message').innerText = 'Failed to fetch data: ' + error.message;
        console.error('There has been a problem with your fetch operation:', error);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'block'; 
});

window.addEventListener('DOMContentLoaded', async () => {
    const statsContainer = document.getElementById('stats');
    try {
        const data = await fetchData();
        displayData(data, statsContainer);
    } catch (error) {
        document.getElementById('error-message').innerText = 'Failed to fetch data: ' + error.message;
        console.error('There has been a problem with your fetch operation:', error);
    } finally {
        const spinner = document.getElementById('loading-spinner');
        spinner.style.display = 'none';
    }
});