class WeatherApp {
    constructor() {
        this.API_KEY = ''; // You'll need to get an API key from OpenWeatherMap
        this.API_URL = 'https://api.openweathermap.org/data/2.5/weather';
        
        this.locationInput = document.getElementById('location-input');
        this.searchBtn = document.getElementById('search-btn');
        this.weatherInfo = document.querySelector('.weather-info');
        this.loading = document.querySelector('.loading');
        this.errorMessage = document.querySelector('.error-message');

        this.initialize();
    }

    initialize() {
        this.searchBtn.addEventListener('click', () => this.getWeather());
        this.locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.getWeather();
            }
        });

        // Get user's location on load
        this.getUserLocation();
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                error => {
                    console.error('Error getting location:', error);
                    this.showError('Unable to get your location. Please enter a city name.');
                }
            );
        }
    }

    async getWeather() {
        const city = this.locationInput.value.trim();
        if (!city) return;

        this.showLoading();
        try {
            const response = await fetch(`${this.API_URL}?q=${city}&appid=${this.API_KEY}&units=metric`);
            const data = await response.json();

            if (response.ok) {
                this.displayWeather(data);
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Failed to fetch weather data. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    async getWeatherByCoords(lat, lon) {
        this.showLoading();
        try {
            const response = await fetch(
                `${this.API_URL}?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
            );
            const data = await response.json();

            if (response.ok) {
                this.displayWeather(data);
            } else {
                this.showError(data.message);
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Failed to fetch weather data. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    displayWeather(data) {
        this.weatherInfo.innerHTML = `
            <div class="weather-main">
                <div class="location">${data.name}, ${data.sys.country}</div>
                <img class="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                <div class="temperature">${Math.round(data.main.temp)}°C</div>
                <div class="weather-description">${data.weather[0].description}</div>
            </div>
            <div class="weather-details">
                <div class="humidity">
                    Humidity
                    <span>${data.main.humidity}%</span>
                </div>
                <div class="wind-speed">
                    Wind Speed
                    <span>${Math.round(data.wind.speed * 3.6)} km/h</span>
                </div>
            </div>
        `;
        this.weatherInfo.style.display = 'block';
        this.hideError();
    }

    showLoading() {
        this.loading.style.display = 'block';
        this.weatherInfo.style.display = 'none';
    }

    hideLoading() {
        this.loading.style.display = 'none';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.style.display = 'block';
        this.weatherInfo.style.display = 'none';
    }

    hideError() {
        this.errorMessage.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const weatherApp = new WeatherApp();
}); 