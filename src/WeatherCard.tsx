import type WeatherCardData from "@/types/WeatherCardData"

const WeatherCard = ({ date, desc, temp, icon }: WeatherCardData) => {
  return (
    <div className="card">
      <p className="date">{date}</p>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <p className="description">{desc}</p>
      <p className="temp">{temp}°c
        {
          temp >= 30 && (
            <span>🥵</span>
          )
        }
        {
          temp < 30 && temp > 14 && (
            <span>🙂</span>
          )
        }
        {
          temp <= 14 && (
            <span>🥶</span>
          )
        }
      </p>
    </div>
  )
}

export default WeatherCard
