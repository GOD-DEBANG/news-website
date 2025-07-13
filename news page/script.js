
const apiKey = 'pub_685756d6b614f33eadd7321b7a72e37598b78';
let apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=us&language=en`;

document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    document.getElementById('search-button').addEventListener('click', searchNews);
    document.getElementById('search-text').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchNews();
        }
    });
    document.getElementById('reload-button').addEventListener('click', reload);
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', onNavItemClick);
    });
    document.getElementById('country-select').addEventListener('change', onCountryChange);
});

async function fetchNews(apiUrlOverride) {
    showLoading();
    try {
        const response = await fetch(apiUrlOverride || apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayNews(data.results);
    } catch (error) {
        console.error('Error fetching news:', error);
    } finally {
        hideLoading();
    }
}

function displayNews(newsArray) {
    const cardsContainer = document.getElementById('cards-container');
    const templateCard = document.getElementById('template-news-card');
    cardsContainer.innerHTML = ''; // Clear existing news cards

    newsArray.forEach(newsItem => {
        const clone = templateCard.content.cloneNode(true);
        const newsImg = clone.querySelector('.news-img');
        newsImg.setAttribute('data-src', newsItem.image_url || 'https://via.placeholder.com/400x200');
        clone.querySelector('.news-title').textContent = newsItem.title;
        clone.querySelector('.news-source').textContent = `${newsItem.source_id || 'Unknown Source'} - ${new Date(newsItem.pubDate).toLocaleDateString()}`;
        clone.querySelector('.news-desc').textContent = newsItem.description || 'No description available.';
        clone.querySelector('.read-more').href = newsItem.link;

        cardsContainer.appendChild(clone);
    });

    lazyLoadImages();
}

function onNavItemClick(event) {
    const category = event.target.getAttribute('data-category');
    const searchApiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&category=${category}&language=en`;
    fetchNews(searchApiUrl);
}

function onCountryChange(event) {
    const country = event.target.value;
    const countryApiUrl = country 
        ? `https://newsdata.io/api/1/news?apikey=${apiKey}&country=${country}&language=en`
        : apiUrl; 
    fetchNews(countryApiUrl);
}

async function searchNews() {
    const searchText = document.getElementById('search-text').value;
    const searchApiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${searchText}&language=en`;

    showLoading();
    try {
        const response = await fetch(searchApiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayNews(data.results);
    } catch (error) {
        console.error('Error searching news:', error);
    } finally {
        hideLoading();
    }
}

function reload() {
    location.reload();
}

function showLoading() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) loadingMessage.style.display = 'block';
}

function hideLoading() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) loadingMessage.style.display = 'none';
}

function lazyLoadImages() {
    const images = document.querySelectorAll('.lazy');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(image => observer.observe(image));
}

function loadAllImages() {
    const images = document.querySelectorAll('.lazy');
    images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.classList.remove('lazy');
    });
}
