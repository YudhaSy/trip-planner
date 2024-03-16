import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Weather } from '../models/weather';
import { WeatherTypeEnum } from '../enums/weatherTypeEnum';
import _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey: string = '05b8fc91c9527768c6103c15987edbc0';

  constructor(private http: HttpClient) { }

  getWeather(cityName: string, weatherType: WeatherTypeEnum): Observable<Weather> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/${weatherType}?q=${cityName}&units=metric&appid=${this.apiKey}`).pipe(
      map((weatherData) => {
        return this.extractData(weatherData);
      })
    )
  }

  /**
   * Convert incoming api data to weather object
   * 
   * @param weatherData incoming api data
   * @returns weather object
   */
  private extractData(weatherData: any): Weather {
    let weather = new Weather();

    if (!_.isNil(weatherData)) {
      weather = this.processCurrentWeather(weatherData);
      if (!_.isNil(weatherData.list) && weatherData.list.length > 0) {
        weather.forecastList = this.processForecastList(weatherData.list);
      }
    }
    return weather;
  }

  /**
   * Get current weather attributes from incoming api data
   * 
   * @param weatherData incoming api data
   * @returns weather object
   */
  private processCurrentWeather(weatherData: any): Weather {
    const currentWeather = new Weather();

    if (!_.isNil(weatherData.dt)) {
      currentWeather.date = new Date(weatherData.dt * 1000);
    }
    if (!_.isNil(weatherData.main)) {
      currentWeather.currentTemp = Math.ceil(weatherData.main.temp!).toString();
      currentWeather.feelsLike = Math.ceil(weatherData.main.feels_like!).toString();
      currentWeather.minTemp = Math.ceil(weatherData.main.temp_min!).toString();
      currentWeather.maxTemp = Math.ceil(weatherData.main.temp_max!).toString();
      currentWeather.humidity = Math.ceil(weatherData.main.humidity!).toString();
    }
    if (!_.isNil(weatherData.weather) && weatherData.weather.length > 0) {
      const weatherInfo = weatherData.weather[0];
      currentWeather.description = weatherInfo.description!.charAt(0).toUpperCase() + weatherInfo.description!.slice(1);
      currentWeather.iconUrl = `http://openweathermap.org/img/wn/${weatherInfo.icon!}.png`;
    }

    return currentWeather;
  }

  /**
   * Get all weather data point for the next 5 days
   * 
   * @param list Unprocessed forecast weather data from api (data point every 3 hours for the next 5 days)
   * @returns processed weather data list where each is at noon everyday for the next 5 days
   */
  private processForecastList(list: any[]): Weather[] {
    const forecastList: Weather[] = [];

    list.forEach((val: any) => {
      const forecastDate = new Date(val.dt * 1000);
      // since api returns every 3 hours, we are just going to get one that is at 12pm
      if (forecastDate.getHours() === 12 && forecastDate.getMinutes() === 0 && forecastDate.getSeconds() === 0) {
        forecastList.push(this.processCurrentWeather(val));
      }
    });

    return forecastList;
  }
}
