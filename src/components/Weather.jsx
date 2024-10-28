import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';
import searchIcon from '../assets/search.png';
import clearIcon from '../assets/clear.png';
import humidityIcon from '../assets/humidity.png';
import windIcon from '../assets/wind.png';
import cloudIcon from '../assets/cloud.png';
import drizzleIcon from '../assets/drizzle.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const iconMapping = {
        "01d": clearIcon,
        "01n": clearIcon,
        "02d": cloudIcon,
        "02n": cloudIcon,
        "03d": cloudIcon,
        "03n": cloudIcon,
        "04d": drizzleIcon,
        "04n": drizzleIcon,
        "09d": rainIcon,
        "09n": rainIcon,
        "10d": rainIcon,
        "10n": rainIcon,
        "13d": snowIcon,
        "13n": snowIcon,
    };

    const searchWeather = async (city) => {
        if (!city) {
            setErrorMessage("Please enter a city name.");
            setWeatherData(null); // Reset weather data
            return;
        }

        setErrorMessage(''); // Clear error message

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message);
                setWeatherData(null); // Reset weather data on error
                return;
            }

            const iconCode = data.weather[0].icon;
            setWeatherData({
                temperature: Math.round(data.main.temp),
                location: data.name,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                icon: iconMapping[iconCode] || clearIcon,
            });
        } catch (error) {
            setErrorMessage("Error fetching weather data.");
            setWeatherData(null); // Reset weather data
            console.error("Error fetching weather data:", error);
        }
    };

    const closeAlert = () => {
        setErrorMessage(''); // Clear error message when closing
    };

    useEffect(() => {
        searchWeather("London");
    }, []);

    return (
        <div className="weather">
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder="Search city" />
                <span onClick={() => searchWeather(inputRef.current.value)}>
                    <img src={searchIcon} alt="Search" />
                </span>
            </div>

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                    <span className="close-alert" onClick={closeAlert}></span>
                </div>
            )}

            {weatherData ? (
                <>
                    <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
                    <p className="temperature">{weatherData.temperature}°C</p>
                    <p className="location">{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidityIcon} alt="Humidity Icon" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={windIcon} alt="Wind Icon" />
                            <div>
                                <p>{weatherData.windSpeed} Km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <p>{errorMessage ? '' : 'Loading...'}</p>
            )}
        </div>
    );
};

export default Weather;
