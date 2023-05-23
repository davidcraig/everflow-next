'use client';
import WeatherCard from '@/src/WeatherCard';
import type OpenWeatherMapForecastResponse from '@/types/OpenWeatherMapForecastResponse';
import { useEffect, useState } from 'react'

const geocodeMemo: {[key: string]: {}} = {}

export default function Home() {
  const [searchCity, setSearchCity] = useState<string>('')
  const [forecast, setForecast] = useState<OpenWeatherMapForecastResponse>();
  const [errors, setErrors] = useState<string[]>([]);

  async function WeatherSearch() {
    setForecast(undefined);
    await GeocodeCity()
    .then((geo: any) => {
      fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geo.lat}&lon=${geo.lon}&units=metric&cnt=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`)
      .then(data => {
        data
          .json()
          .then(json => {
            setForecast(json)
          })
          .catch(err => setErrors([...errors, err]))
      })
      .catch(err => setErrors([...errors, err]))
    })
    .catch(err => setErrors([...errors, err]))
  }

  async function GeocodeCity() {
    return new Promise((resolve, reject) => {
      if (geocodeMemo[searchCity]) {
        return resolve(geocodeMemo[searchCity])
      }

      fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchCity}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`)
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

  return (
    <>
      <nav className="flex p-4">
        <a>Everflow Weather Dashboard</a>
      </nav>

      <main className="p-4">
        <h1>Hows the weather?</h1>
        <form onSubmit={(e) => {
          e.preventDefault()
          WeatherSearch()
        }}>
          <input placeholder='Enter city then click search' type='text' onChange={(e) => setSearchCity(e.target.value)} />
          <button className='ml-2 px-2'>Search</button>
        </form>
        

        { /* Cards */ }
        {forecast && forecast.list && (
          <>
            <div className='grid gap-2 grid-cols-1 md:grid-cols-3 lg:grid-cols-5'>
            {forecast.list.map((item) =>
              <WeatherCard
                key={item.dt_txt}
                date={item.dt_txt}
                desc={item.weather[0].description}
                temp={item.main.temp}
                icon={item.weather[0].icon}
              />
            )}
            </div>
          </>
        )}

        {errors && errors.length > 0 && (
          <>
            <h1>Errors</h1>
            {errors.map(e => <p>{e}</p>)}
          </>
        )}
      </main>
    </>
  )
}
