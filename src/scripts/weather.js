class WeatherApp {
    constructor() {
        // Using Open-Meteo API - no API key required
        this.GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
        this.WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

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
        } else {
            this.showError('Geolocation is not supported by this browser. Please enter a city name.');
        }
    }

    async getWeather() {
        const city = this.locationInput.value.trim();
        if (!city) return;

        this.showLoading();
        try {
            // First, get coordinates for the city using geocoding
            const geoResponse = await fetch(`${this.GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                this.showError('City not found. Please try another city name.');
                return;
            }

            const location = geoData.results[0];
            await this.getWeatherByCoords(location.latitude, location.longitude, location.name, location.country);
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Failed to fetch weather data. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    async getWeatherByCoords(lat, lon, locationName = null, country = null) {
        this.showLoading();
        try {
            const response = await fetch(
                `${this.WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto&forecast_days=1`
            );
            const data = await response.json();

            if (response.ok) {
                // If we don't have location name, try to get it via reverse geocoding
                if (!locationName) {
                    try {
                        const geoResponse = await fetch(`${this.GEOCODING_URL}?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`);
                        const geoData = await geoResponse.json();
                        if (geoData.results && geoData.results.length > 0) {
                            locationName = geoData.results[0].name;
                            country = geoData.results[0].country;
                        }
                    } catch (error) {
                        console.warn('Could not get location name:', error);
                        locationName = 'Unknown Location';
                    }
                }

                this.displayWeather(data, locationName, country);
            } else {
                this.showError('Failed to fetch weather data');
            }
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.showError('Failed to fetch weather data. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    displayWeather(data, locationName, country) {
        const current = data.current;
        const weatherDescription = this.getWeatherDescription(current.weather_code);
        const weatherIcon = this.getWeatherIcon(current.weather_code);

        this.weatherInfo.innerHTML = `
            <div class="weather-main">
                <div class="location">${locationName}${country ? `, ${country}` : ''}</div>
                <div class="weather-icon">${weatherIcon}</div>
                <div class="temperature">${Math.round(current.temperature_2m)}°C</div>
                <div class="weather-description">${weatherDescription}</div>
            </div>
            <div class="weather-details">
                <div class="humidity">
                    Humidity
                    <span>${current.relative_humidity_2m}%</span>
                </div>
                <div class="wind-speed">
                    Wind Speed
                    <span>${Math.round(current.wind_speed_10m)} km/h</span>
                </div>
            </div>
        `;
        this.weatherInfo.style.display = 'block';
        this.hideError();
    }

    getWeatherDescription(code) {
        const descriptions = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Fog',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            56: 'Light freezing drizzle',
            57: 'Dense freezing drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            66: 'Light freezing rain',
            67: 'Heavy freezing rain',
            71: 'Slight snow fall',
            73: 'Moderate snow fall',
            75: 'Heavy snow fall',
            77: 'Snow grains',
            80: 'Slight rain showers',
            81: 'Moderate rain showers',
            82: 'Violent rain showers',
            85: 'Slight snow showers',
            86: 'Heavy snow showers',
            95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail',
            99: 'Thunderstorm with heavy hail'
        };
        return descriptions[code] || 'Unknown';
    }

    getWeatherIcon(code) {
        const icons = {
            0: '☀️',
            1: '🌤️',
            2: '⛅',
            3: '☁️',
            45: '🌫️',
            48: '🌫️',
            51: '🌦️',
            53: '🌦️',
            55: '🌦️',
            56: '🌨️',
            57: '🌨️',
            61: '🌧️',
            63: '🌧️',
            65: '🌧️',
            66: '🌨️',
            67: '🌨️',
            71: '🌨️',
            73: '❄️',
            75: '❄️',
            77: '🌨️',
            80: '🌦️',
            81: '🌧️',
            82: '⛈️',
            85: '🌨️',
            86: '❄️',
            95: '⛈️',
            96: '⛈️',
            99: '⛈️'
        };
        return icons[code] || '🌤️';
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
