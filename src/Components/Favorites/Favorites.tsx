import axios from 'axios';
import { useEffect, useState } from 'react';
import './style.css'

interface CityData {
  Key: string;
  EnglishName: string;
  Country: {
    EnglishName: string;
  };
  
}

interface Temperature {
  Maximum: {
    Value: number;
    Unit: string;
  };
  Minimum: {
    Value: number;
    Unit: string;
  };
}

interface Forecast {
  Date: string;
  Temperature: Temperature;
}

interface FavoritesProps {
  favorites: CityData[];
  selectFavorite: (city: CityData) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ favorites, selectFavorite }) => {
  const [temperatureData, setTemperatureData] = useState<Record<string, number>>({});

  useEffect(() => {
    favorites.forEach(city => fetchTemperature(city.Key));
  }, [favorites]);

  const fetchTemperature = (locationKey: string) => {
    axios.get(`https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=ICfOrVGI3ofdnGODMlLrRMwyPbISOCdO`)
    .then((res) => {
      setTemperatureData(prevState => ({...prevState, [locationKey]: res.data[0].Temperature.Metric.Value}));
    }).catch(err => console.log(err.message));
    
  }

  return (
      <div className='fav-list'>
        <h2 id='favorites-title'>Favorites</h2>
        {favorites.map(city => (
          <div key={city.Key} className='favorites'>
            <h3>{city.EnglishName}, {city.Country.EnglishName}</h3>
            <p>{temperatureData[city.Key]}°C</p>
            <button className='show-det' onClick={() => selectFavorite(city)}>Show More Details </button>
          </div>
        ))}
      </div>
    );
  }

export default Favorites;
