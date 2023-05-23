import type WeatherCardData from "@/types/WeatherCardData"

const WeatherCard = ({ date, desc, temp, icon }: WeatherCardData) => {
  const emoji = temp >= 30 ? "🥵" : temp > 14 ? "🙂" : "🥶"

  return (
    <div className="card">
      <p className="date">{new Date(date).toLocaleString()}</p>
      <img width={100} height={100} src={`https://openweathermap.org/img/wn/${icon}@2x.png`} />
      <p className="description">{desc}</p>
      <p>{temp}°c {emoji}</p>
    </div>
  )
}

export default WeatherCard
