import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [city, setCity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCity, setLastCity] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch weather data based on city name
  const fetchWeather = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=dd082ab067908e2857addceafce4a67f`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      const data = await response.json();
      setWeather(data);
      // Save the city to localStorage
      localStorage.setItem('lastCity', city);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    fetchWeather(city);
    setShowConfirmation(true);
  };

  // Convert temperature from Kelvin to Fahrenheit
  const kelvinToFahrenheit = (kelvin) => {
    return ((kelvin - 273.15) * 9/5) + 32;
  };

  // Request user's location and update the city
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=dd082ab067908e2857addceafce4a67f`)
            .then(response => response.json())
            .then(data => {
              setCity(data.name);
              setUserLocation({
                latitude,
                longitude
              });
            })
            .catch(err => {
              console.error('Failed to fetch weather data', err);
            });
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  // Effect to automatically get user location or last searched city
  useEffect(() => {
    // Retrieve the last searched city from localStorage
    const savedCity = localStorage.getItem('lastCity');
    if (savedCity) {
      setCity(savedCity);
      fetchWeather(savedCity);
      setLastCity(savedCity);
    } else {
      getUserLocation();
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
      </header>
      <div className="App-content">
        <div>
          <label>
            Customer
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            U.S. city
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleSubmit}>
          Submit
        </button>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {weather && (
          <div>
            <h2>Weather in {weather.name}</h2>
            <p>Temperature: {Math.round(kelvinToFahrenheit(weather.main.temp))}°F</p>
            <p>Weather: {weather.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
            />
          </div>
        )}

        {showConfirmation && (
          <div className="Confirmation-message">
            <p>Congrats On Your Choice, {customerName}!</p>
          </div>
        )}

        {lastCity && !loading && !error && (
          <div className="Last-searched">
            <p>Last searched city: {lastCity}</p>
          </div>
        )}
      </div>
      <footer className="App-footer">
        {/* Add footer content if neededi*/}
      </footer>
    </div>
  );
}

export default App;
