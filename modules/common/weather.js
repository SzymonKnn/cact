import axios from "axios";
function geGeoUrl(city){
    return 'http://api.openweathermap.org/geo/1.0/direct?q=' +city +'&limit=1&appid=';
}
function getWeatherUrl(lon, lat){
    
    return 'https://api.openweathermap.org/data/3.0/onecall?lat=' +lat +'&lon=' +lon +'&exclude=hourly,daily&units=metric&appid='
}
export default{
     
    getCityData(city){
        return axios.get(geGeoUrl(city), {}).then((resp) =>{return resp})
    },

    getCityWeather(lon, lat){
        return axios.get(getWeatherUrl(lon, lat),{}).then((resp) =>{return resp})
    }
}