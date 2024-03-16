import { Component, Input } from '@angular/core';
import { Weather } from '../../models/weather';
import { Subscription } from 'rxjs';
import { WeatherService } from '../../services/weather.service';
import { WeatherTypeEnum } from '../../enums/weatherTypeEnum';
import _ from 'lodash';
import { DisplayType } from '../../enums/displayType';
import { DisplayDataWrapper } from '../../models/displayDataWrapper';

@Component({
  selector: 'app-city-weather',
  templateUrl: './city-weather.component.html',
  styleUrl: './city-weather.component.css'
})
export class CityWeatherComponent {
  @Input() set cityName(val: string) {
    this.bsValue = new Date();
    this.forecastWeatherDataList = [...[]];
    this._cityName = val;
    this.getWeatherData(WeatherTypeEnum.Current);
  }

  data: DisplayDataWrapper = {
    fetchingData: false,
    fetchingMsg: 'Fetching Weather Data...',
    type: DisplayType.Weather,
    weather: null,
    errorMsg: null
  };
  _cityName: null | string = null;
  currentWeatherData: Weather | null = null;
  forecastWeatherDataList: Weather[] = [];
  subscriptions: Subscription[] = [];
  minDate: Date = new Date();
  maxDate: Date = new Date();
  bsConfig = { minDate: this.minDate, maxDate: this.maxDate, showWeekNumbers: false, isAnimated: true, keepDatepickerOpened: true, rangeInputFormat: 'MMMM Do YYYY', dateInputFormat: 'MMMM Do YYYY' };
  bsValue: Date = new Date();

  constructor(private weatherService: WeatherService) {
    this.maxDate.setDate(this.maxDate.getDate() + 5);
  }

  ngOnDestroy() {
    // This ensures that any ongoing subscriptions are terminated when the component is destroyed, preventing memory leaks.
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private getWeatherData(type: WeatherTypeEnum) {
    this.data.errorMsg = null;
    this.data.fetchingData = true;

    this.subscriptions.push(this.weatherService.getWeather(this._cityName!, type).subscribe({
      next: (val) => {
        if (type === WeatherTypeEnum.Current) {
          this.currentWeatherData = val;
          this.data.weather = val;
        } else {
          this.forecastWeatherDataList = val.forecastList;
          this.getForecastDisplayData();
        }
        this.data.fetchingData = false;
      },
      error: (err) => {
        console.error(err);
        this.data.errorMsg = `Weather data for ${this._cityName} is not available!`
        this.data.fetchingData = false;
      }
    }));
  }

  handleWeatherByDateChange() {
    // we need to ensure upon initialization that we don't call get weather,
    // hence we are checking for fetchingData as well
    if (this._cityName !== null && !this.data.fetchingData) {
      if (this.bsValue.toDateString() === this.minDate.toDateString()) {
        this.currentWeatherData === null ?
          this.getWeatherData(WeatherTypeEnum.Current) :
          this.data.weather = { ...this.currentWeatherData! };
      } else {
        // if we already have forecast data, get it locally. Otherwise get fresh data from API
        if (this.forecastWeatherDataList.length === 0) {
          this.getWeatherData(WeatherTypeEnum.Forecast);
        } else {
          this.getForecastDisplayData();
        }
      }
    }
  }

  getForecastDisplayData() {
    this.data.weather = _.find(this.forecastWeatherDataList, (data: Weather) => {
      return this.bsValue.toDateString() === data.date!.toDateString();
    });
  }
}
