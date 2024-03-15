import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CurrentWeather } from '../models/currentWeather';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  apiKey: string = '05b8fc91c9527768c6103c15987edbc0';

  constructor(private http: HttpClient) { }

  getWeather(cityName: string): Observable<CurrentWeather> {
    return this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${this.apiKey}`).pipe(
      map((weatherData) => {
        return new CurrentWeather(weatherData);
      })
    )
  }
}
