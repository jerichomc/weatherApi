import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "64c236e854b03de2c2dd2cc80fe344c2"; 
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

function App() {
  
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);

  //C to F conversion
  const convertToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  //dynamic bg color
  const setBackgroundColor = () => {
    if (!weather) return { backgroundColor: "#f0f0f0" }; //gray if no weather data
    const temp = weather.main.temp;
    if (temp > 30) return { backgroundColor: "#FF6F61" }; // Hot weather
    if (temp > 15) return { backgroundColor: "#FFEB3B" }; // Mild weather
    return { backgroundColor: "#ADD8E6" }; // Cool weather 
  };

  // Fetch weather data when the button is clicked
  const fetchWeather = async () => {
    if (!city) return; //Do nothing if the city is empty
    try {
      const response = await axios.get(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      console.log(response.data); 
      setWeather(response.data); 
      setError(""); 
    } catch (err) {
      console.error(err);
      setError("City not found. Please try again.");
      setWeather(null); 
    }
  };

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };


  const getWeatherIcon = (icon) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`; 
  };

  return (
    <div className="App" style={setBackgroundColor()}>
      <h1>Weather Dashboard</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)} 
      />
      <button onClick={fetchWeather}>Get Weather</button>

   
      <button onClick={toggleTemperature}>
        {isCelsius ? "Switch to Fahrenheit" : "Switch to Celsius"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}


      {weather && (
        <div className="weather-info">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img src={getWeatherIcon(weather.weather[0].icon)} alt="weather icon" />
          <p>{weather.weather[0].description}</p>
          <p>
            Temperature: {isCelsius ? weather.main.temp : convertToFahrenheit(weather.main.temp)}°
            {isCelsius ? "C" : "F"}
          </p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
