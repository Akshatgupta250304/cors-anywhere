const API_KEY = 'Y36Y1TMCB75RK5SZ';
const BASE_URL = 'https://www.alphavantage.co/query';
const CORS_PROXY = 'https://cors-anywhere-git-master-akshatgupta250304s-projects.vercel.app/';

async function fetchNews() {
    const symbol = document.getElementById('stock-symbol').value;
    try {
        const response = await fetch(`${CORS_PROXY}${BASE_URL}?function=NEWS_SENTIMENT&symbol=${symbol}&apikey=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        displayNews(data);
    } catch (error) {
        console.error('Error fetching stock news:', error);
        alert(`Failed to fetch stock news. Error: ${error.message}`);
    }
}

async function fetchHighsLows() {
    try {
        const nseResponse = await fetch(`${CORS_PROXY}${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=NSE&interval=5min&apikey=${API_KEY}`);
        if (!nseResponse.ok) {
            throw new Error(`HTTP error! Status: ${nseResponse.status}`);
        }
        const bseResponse = await fetch(`${CORS_PROXY}${BASE_URL}?function=TIME_SERIES_INTRADAY&symbol=BSE&interval=5min&apikey=${API_KEY}`);
        if (!bseResponse.ok) {
            throw new Error(`HTTP error! Status: ${bseResponse.status}`);
        }

        const nseData = await nseResponse.json();
        const bseData = await bseResponse.json();

        const nseHighsLows = processHighsLows(nseData);
        const bseHighsLows = processHighsLows(bseData);

        document.getElementById('nse-high').innerText = nseHighsLows.highs;
        document.getElementById('nse-low').innerText = nseHighsLows.lows;
        document.getElementById('bse-high').innerText = bseHighsLows.highs;
        document.getElementById('bse-low').innerText = bseHighsLows.lows;
    } catch (error) {
        console.error('Error fetching highs and lows:', error);
        alert(`Failed to fetch highs and lows. Error: ${error.message}`);
    }
}

function processHighsLows(data) {
    if (!data || !data['Time Series (5min)']) {
        console.error('Invalid data format:', data);
        alert('Received invalid data format from API.');
        return { highs: '-', lows: '-' };
    }

    const timeSeries = data['Time Series (5min)'];
    const prices = Object.values(timeSeries).map(entry => ({
        high: parseFloat(entry['2. high']),
        low: parseFloat(entry['3. low']),
    }));
    const highs = Math.max(...prices.map(price => price.high));
    const lows = Math.min(...prices.map(price => price.low));
    return { highs, lows };
}

function displayNews(newsData) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';

    if (newsData && newsData.length > 0) {
        newsData.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');
            newsItem.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            `;
            newsContainer.appendChild(newsItem);
        });
    } else {
        newsContainer.innerHTML = '<p>No news available</p>';
    }
}
