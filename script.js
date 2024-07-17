document.addEventListener('DOMContentLoaded', () => {
    const your_api_key = 'PispbVyC8OTbUFx20H6rGMkuU83QQzdRa3cwdvsq';

    function getCurrentImageOfTheDay() {
        const currentDate = new Date().toISOString().split("T")[0];
        document.getElementById('headings').innerText = `Picture On ${currentDate}`;
        fetch(`https://api.nasa.gov/planetary/apod?date=${currentDate}&api_key=${your_api_key}`)
            .then(response => response.json())
            .then(data => {
                displayMedia(data);
            })
            .catch(err => { console.error("Data Not Found", err); });
    }

    function displayMedia(data) {
        let mediaContainer = document.getElementById('media-container');
        let mediaElement;
        if (data.media_type === 'image') {
            mediaElement = `<img id="imges" src="${data.url}" alt="NASA Astronomy Picture of the Day" style="max-width: 100%; max-height: 100%;">`;
        } else if (data.media_type === 'video') {
            mediaElement = `<iframe id="imges" src="${data.url}" frameborder="0" allowfullscreen style="width: 100%; height: 100%;"></iframe>`;
        }

        mediaContainer.innerHTML = mediaElement;
        document.getElementById('description').innerText = data.explanation;
    }

    function getImageOfTheDay(event) {
        event.preventDefault();
        let dateInput = document.getElementById('search-input').value;
        document.getElementById('headings').innerText = `Picture On ${dateInput}`;
        fetch(`https://api.nasa.gov/planetary/apod?date=${dateInput}&api_key=${your_api_key}`)
            .then(response => response.json())
            .then(data => {
                displayMedia(data);
                saveSearch(dateInput);
            })
            .catch(err => { console.error("Data Not Found", err); });
    }

    function saveSearch(date) {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        if (!searchHistory.includes(date)) {
            searchHistory.push(date);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            updateSearchHistory();
        }
    }

    function updateSearchHistory() {
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        let list = document.getElementById('search-history');
        list.innerHTML = '';
        searchHistory.forEach(date => {
            let listItem = document.createElement('li');
            listItem.innerHTML = `<a href="javascript:void(0)" onclick="fetchImage('${date}')">${date}</a>`;
            list.appendChild(listItem);
        });
    }

    window.fetchImage = function(date) {
        fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${your_api_key}`)
            .then(response => response.json())
            .then(data => {
                displayMedia(data);
            })
            .catch(err => { console.error("Data Not Found", err); });
    }

    document.getElementById('search-form').addEventListener('submit', getImageOfTheDay);
    getCurrentImageOfTheDay();
    updateSearchHistory();
});