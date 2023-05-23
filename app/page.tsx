'use client';
import WeatherCard from '@/src/WeatherCard';
import type WeatherCardData from '@/types/WeatherCardData';
import type OpenWeatherMapForecastResponse from '@/types/OpenWeatherMapForecastResponse';
import { useEffect, useState } from 'react'

const geocodeMemo: {[key: string]: {}} = {}

export default function Home() {
  const [searchCity, setSearchCity] = useState<string>('')
  const [forecast, setForecast] = useState<OpenWeatherMapForecastResponse>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function WeatherSearch() {
    await GeocodeCity()
    .then(geo => {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&units=metric&cnt=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`)
      .then(data => {
        data
          .json()
          .then(json => {
            console.log(json)
            setForecast(json)
            // return json[0]
          })
          .catch(err => setErrors([...errors, err]))
      })
      .catch(err => setErrors([...errors, err]))
      })
      .catch(err => {})
  }

  async function GeocodeCity() {
    return new Promise((resolve, reject) => {
      if (geocodeMemo[searchCity]) {
        return resolve(geocodeMemo[searchCity])
      }

      fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`)
      .then(data => {
        data
          .json()
          .then(json => {
            geocodeMemo[searchCity] = json[0]
            return resolve(json[0])
          })
          .catch(err => {
            setErrors([...errors, err])
            return reject(err)
          })
      })
      .catch(err => {
        setErrors([...errors, err])
        return reject(err)
      })

    })
  }

  // const mockJson = "{\"cod\":\"200\",\"message\":0,\"cnt\":5,\"list\":[{\"dt\":1684681200,\"main\":{\"temp\":15.61,\"feels_like\":15,\"temp_min\":13.41,\"temp_max\":15.61,\"pressure\":1024,\"sea_level\":1024,\"grnd_level\":1020,\"humidity\":68,\"temp_kf\":2.2},\"weather\":[{\"id\":803,\"main\":\"Clouds\",\"description\":\"broken clouds\",\"icon\":\"04d\"}],\"clouds\":{\"all\":65},\"wind\":{\"speed\":3.27,\"deg\":87,\"gust\":3.39},\"visibility\":10000,\"pop\":0,\"sys\":{\"pod\":\"d\"},\"dt_txt\":\"2023-05-21 15:00:00\"},{\"dt\":1684692000,\"main\":{\"temp\":14.54,\"feels_like\":13.77,\"temp_min\":12.39,\"temp_max\":14.54,\"pressure\":1024,\"sea_level\":1024,\"grnd_level\":1020,\"humidity\":66,\"temp_kf\":2.15},\"weather\":[{\"id\":803,\"main\":\"Clouds\",\"description\":\"broken clouds\",\"icon\":\"04d\"}],\"clouds\":{\"all\":56},\"wind\":{\"speed\":2.93,\"deg\":83,\"gust\":3.7},\"visibility\":10000,\"pop\":0,\"sys\":{\"pod\":\"d\"},\"dt_txt\":\"2023-05-21 18:00:00\"},{\"dt\":1684702800,\"main\":{\"temp\":11.9,\"feels_like\":11.08,\"temp_min\":10.04,\"temp_max\":11.9,\"pressure\":1025,\"sea_level\":1025,\"grnd_level\":1021,\"humidity\":74,\"temp_kf\":1.86},\"weather\":[{\"id\":802,\"main\":\"Clouds\",\"description\":\"scattered clouds\",\"icon\":\"03n\"}],\"clouds\":{\"all\":26},\"wind\":{\"speed\":1.02,\"deg\":51,\"gust\":1.14},\"visibility\":10000,\"pop\":0,\"sys\":{\"pod\":\"n\"},\"dt_txt\":\"2023-05-21 21:00:00\"},{\"dt\":1684713600,\"main\":{\"temp\":9.23,\"feels_like\":8.94,\"temp_min\":9.23,\"temp_max\":9.23,\"pressure\":1025,\"sea_level\":1025,\"grnd_level\":1020,\"humidity\":77,\"temp_kf\":0},\"weather\":[{\"id\":801,\"main\":\"Clouds\",\"description\":\"few clouds\",\"icon\":\"02n\"}],\"clouds\":{\"all\":11},\"wind\":{\"speed\":1.35,\"deg\":340,\"gust\":1.41},\"visibility\":10000,\"pop\":0,\"sys\":{\"pod\":\"n\"},\"dt_txt\":\"2023-05-22 00:00:00\"},{\"dt\":1684724400,\"main\":{\"temp\":8.23,\"feels_like\":6.73,\"temp_min\":8.23,\"temp_max\":8.23,\"pressure\":1024,\"sea_level\":1024,\"grnd_level\":1019,\"humidity\":76,\"temp_kf\":0},\"weather\":[{\"id\":801,\"main\":\"Clouds\",\"description\":\"few clouds\",\"icon\":\"02n\"}],\"clouds\":{\"all\":16},\"wind\":{\"speed\":2.49,\"deg\":314,\"gust\":2.68},\"visibility\":10000,\"pop\":0,\"sys\":{\"pod\":\"n\"},\"dt_txt\":\"2023-05-22 03:00:00\"}],\"city\":{\"id\":2636531,\"name\":\"Sunderland\",\"coord\":{\"lat\":54.9059,\"lon\":-1.3829},\"country\":\"GB\",\"population\":177965,\"timezone\":3600,\"sunrise\":1684640954,\"sunset\":1684700115}}";
  // const mockData = JSON.parse(mockJson);

  return (
    <>
      <nav className="flex p-4">
        <a>Everflow Weather Dashboard</a>
      </nav>

      <main className="p-4">
        <h1>Hows the weather?</h1>
        <input type='text' onChange={(e) => setSearchCity(e.target.value)} />
        <button onClick={() => WeatherSearch()} className='ml-2 px-2'>Search</button>

        { /* Cards */ }
        {forecast && forecast.list && (
          <>
            <div className='grid gap-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-5'>
            {forecast.list.map((item: OpenWeatherMapForecastResponse) => (
              <WeatherCard
                date={item.dt_txt}
                desc={item.weather[0].description}
                temp={item.main.temp}
                icon={item.weather[0].icon}
              />
            ))}
            </div>
          </>
        )}

        {errors && errors.length > 0 && (
          <>
            {errors.map(e => <p>{e}</p>)}
          </>
        )}
      </main>
    </>
  )
}
