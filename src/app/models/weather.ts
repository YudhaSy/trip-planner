import _ from 'lodash';

export class Weather {
    date?: Date;
    iconUrl!: string;
    currentTemp!: string;
    feelsLike!: string;
    minTemp!: string;
    maxTemp!: string;
    humidity!: string;
    description!: string;
    forecastList: Weather[] = [];

    constructor(weatherVal: any) {
        if (!_.isNil(weatherVal)) {
            if (!_.isNil(weatherVal.dt)) {
                this.date = new Date(weatherVal.dt * 1000);
            }
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
            if (!_.isNil(weatherVal.list) && weatherVal.list.length > 0) {
                weatherVal.list.forEach((val: any) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const forecastDate = new Date(val.dt * 1000);

                    // Filter data based on the date range and time condition
                    // Check if the forecast date is noon and not today
                    if (forecastDate.getHours() === 12 && forecastDate.getMinutes() === 0 &&
                        forecastDate.getSeconds() === 0 && forecastDate.toDateString() !== today.toDateString()) {
                        this.forecastList.push(new Weather(val));
                    }
                });
            }
        }
    }
}
