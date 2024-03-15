import _ from 'lodash';

export class CurrentWeather {
    iconUrl!: string;
    currentTemp!: string;
    feelsLike!: string;
    minTemp!: string;
    maxTemp!: string;
    humidity!: string;
    description!: string;

    constructor(weatherVal: any) {
        if (!_.isNil(weatherVal)) {
            if (!_.isNil(weatherVal.main)) {
                this.currentTemp = Math.ceil(weatherVal.main.temp!).toString();
                this.feelsLike = Math.ceil(weatherVal.main.feels_like!).toString();
                this.minTemp = Math.ceil(weatherVal.main.temp_min!).toString();
                this.maxTemp = Math.ceil(weatherVal.main.temp_max!).toString();
                this.humidity = Math.ceil(weatherVal.main.humidity!).toString();
            }
            if (!_.isNil(weatherVal.weather) && weatherVal.weather.length > 0) {
                const weatherData = weatherVal.weather[0];
                this.description = weatherData.description!.charAt(0).toUpperCase() + weatherData.description!.slice(1);
                this.iconUrl = `http://openweathermap.org/img/wn/${weatherData.icon!}.png`;
            }
        }
    }
}
