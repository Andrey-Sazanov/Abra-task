import axios from 'axios';
import { useEffect, useState } from 'react';
import './style.css'

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
  WeatherText: string;
}

interface FiveDayForecastProps {
  cityKey: string;
}

const FiveDayForecast: React.FC<FiveDayForecastProps> = ({ cityKey }) => {
  const [forecast, setForecast] = useState<Forecast[]>([]);

  useEffect(() => {
    axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=ICfOrVGI3ofdnGODMlLrRMwyPbISOCdO&metric=true`)
      .then((res) => {
        setForecast(res.data.DailyForecasts);
      }).catch(err => console.log(err.message));
  }, [cityKey]);

  return (
    <div className='forecast'>
      <div className='data'>
      {forecast.map(day => (
        <div className='days' key={day.Date}>
          <h3>{new Date(day.Date).toLocaleDateString('en-US',{weekday:'long'})}</h3>
          <p>Max: {day.Temperature.Maximum.Value} {day.Temperature.Maximum.Unit}</p>
          <p>Min: {day.Temperature.Minimum.Value} {day.Temperature.Maximum.Unit}</p>
        </div>
      ))}
      </div>
    </div>
  );
}

export default FiveDayForecast;
