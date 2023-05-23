type OpenWeatherMapForecastResponse = {
  list: ForecastList[];
  [key: string]: any;
}

type ForecastList = {
  dt: number;
  dt_txt: string;
  main: ForecastMain;
  weather: ForecastWeather[];
}

type ForecastMain = {
  temp: number;
  [key: string]: any;
}

type ForecastWeather = {
  id: number;
  main: string;
  description: string;
  icon: string;
}

type City = {

}

export default OpenWeatherMapForecastResponse
