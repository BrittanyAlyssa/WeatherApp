import { useState, useEffect } from "react";
import "./App.css";

const api = {
  key: "f27fd260947039ae2b6a5aaed5c97f5a",
  base: "https://api.openweathermap.org/data/2.5/",
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setStatus("");
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);

          console.log(position);
          fetch(
            `${api.base}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api.key}&units=imperial`
          )
            .then((res) => res.json())
            .then((result) => {
              setWeather(result);
              setQuery("");
              console.log(result);
            });
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  }, []);

  const Search = (evt) => {
    if (evt.key == "Enter") {
      fetch(`${api.base}weather?q=${query}&units=imperial&appid=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          setWeather(result);
          setQuery("");
          console.log(result);
        });
    }
  };

  return (
    <div
      className={
        typeof weather.main != "undefined"
          ? weather.main.temp > 60
            ? "app warm"
            : "app"
          : "app"
      }
    >
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search City.."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={Search}
          />
        </div>

        <div className="status-text">{status}</div>
        {typeof weather.main != "undefined" ? (
          <div>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°F</div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : (
          ""
        )}
      </main>
    </div>
  );
}

export default App;
