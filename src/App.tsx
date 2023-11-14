import axios from 'axios';
import { useState,useEffect } from 'react';
import './App.css'
import Favorites from './Components/Favorites/Favorites';
import { WeatherViewer } from './Components/Weather/WeatherViewer';
import FiveDayForecast from './Components/ForeCast/FiveDayForecast';

interface CityData {
  Key: string;
  EnglishName: string;
  Country: {
    EnglishName: string;
  };
  
}

interface ForecastData {
  DateTime: string;
  Temperature: {
    Value: number;
    Unit: string;
  };
  WeatherText: string;
}

function App() {
  const [citySearch, setCitySearch] = useState<string>('');
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [favorites, setFavorites] = useState<CityData[]>([]);
  const [currentPage, setCurrentPage] = useState<'weather' | 'favorites'>('weather');
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [coordinates, setCoordinates] = useState<{ lat: number, lon: number } | null>(null);
  const fetchCity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=bE26rmqv0WnEvG6cLJ6ZxUiONkEDSA1C&q=${citySearch}`)
    .then((res)=>{
      setCityData(res.data[0]);
      setCitySearch('');
      
    }).catch(err=>console.log(err.message));
  }

  useEffect(() => {
    // Check if geolocation is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Set the coordinates state
        setCoordinates({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    // If coordinates are available, fetch the location key
    if (coordinates) {
      axios.get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=bE26rmqv0WnEvG6cLJ6ZxUiONkEDSA1C&q=${coordinates.lat},${coordinates.lon}`)
      .then((res) => {
        setCityData(res.data);
      }).catch(err => console.log(err.message));
    }
  }, [coordinates]);

  const addToFavorites = (city: CityData) => {
    setFavorites([...favorites, city]);
  }

  const removeFromFavorites = (city: CityData) => {
    setFavorites(favorites.filter(fav => fav.Key !== city.Key));
  }

  const selectFavorite = (city: CityData) => {
    setCityData(city);
    setCurrentPage('weather');
  }

  return (
    <div className="wrapper">
      <nav className='nav'>
            <button id = 'weather-page' onClick={() => setCurrentPage('weather')}>Weather</button>
            <button id ='fav-page'onClick={() => setCurrentPage('favorites')}>Favorites</button>
      </nav>
      {currentPage === 'weather' ? (
        <div className='the-app'>
          <form className='search' autoComplete='off'
          onSubmit={fetchCity}>
            <div className='search-box'>
              <input className='form-control' type='search' required placeholder='Enter city name...'
              value={citySearch} onChange={(e)=>setCitySearch(e.target.value)}/>
              <button type='submit' className="btn-search">
              <svg className='search-svg' xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#616161" d="M34.6 28.1H38.6V45.1H34.6z" transform="rotate(-45.001 36.586 36.587)"></path><path fill="#616161" d="M20 4A16 16 0 1 0 20 36A16 16 0 1 0 20 4Z"></path><path fill="#37474F" d="M36.2 32.1H40.2V44.400000000000006H36.2z" transform="rotate(-45.001 38.24 38.24)"></path><path fill="#64B5F6" d="M20 7A13 13 0 1 0 20 33A13 13 0 1 0 20 7Z"></path><path fill="#BBDEFB" d="M26.9,14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2,1.2-6.9,3.2c-0.4,0.4-0.3,1.1,0.1,1.4c0.4,0.4,1.1,0.3,1.4-0.1C16,13.9,17.9,13,20,13s4,0.9,5.4,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.2,0,0.5-0.1,0.6-0.2C27.2,15.3,27.2,14.6,26.9,14.2z"></path>
</svg>
              </button>
            </div>
          </form>
          <div className='weather-view'>{cityData && <WeatherViewer cityData={cityData} addToFavorites={addToFavorites} removeFromFavorites={removeFromFavorites} favorites={favorites} />}</div>
          <div className="forecast"> {cityData && <FiveDayForecast cityKey={cityData.Key} />}</div>
        </div>
      ) : (
        <Favorites favorites={favorites} selectFavorite={selectFavorite} />
      )}
    </div>
  );
}

export default App;
