import { Component } from '@angular/core';
import { WikipediaService } from './services/wikipedia.service';
import { WeatherService } from './services/weather.service';
import { CurrentWeather } from './models/currentWeather';
import { Subscription } from 'rxjs';
import { Select } from './models/select';

interface Data {
  [key: string]: Select[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title: string = 'Trip Planner';
  selectedCity: number | null = null;
  selectedCityDescription: string | null = null;
  cities: Select[] = [
    { id: 1, name: 'Calgary' },
    { id: 2, name: 'Edmonton' },
    { id: 3, name: 'Vancouver' },
    { id: 4, name: 'Toronto' },
    { id: 5, name: 'Montreal' }
  ];
  fetchingCityDescriptionData = false;
  weatherTypes: Select[] = [
    { id: 1, name: 'Current Weather' },
    { id: 2, name: '5 Days Weather Forecast' }
  ];
  currentWeatherErrorMsg = '';
  cityDesriptionErrorMsg = '';
  fetchingCurrentWeatherData = false;
  selectedWeatherType: number = 1;
  weather: CurrentWeather | null = null;
  subscriptions: Subscription[] = [];
  data: Data = {
    cities: this.cities,
    weatherTypes: this.weatherTypes
  };

  constructor(private wikipediaService: WikipediaService,
    private weatherService: WeatherService) { }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  citySelectionChange(cityId: number) {
    const city = this.getObjectFromList(cityId, 'cities');

    if (city !== undefined) {
      this.fetchingCityDescriptionData = true;

      this.subscriptions.push(this.wikipediaService.getCityDescription(city.name).subscribe({
        next: (val) => {
          this.selectedCityDescription = val;
          this.fetchingCityDescriptionData = false;
        },
        error: (err) => {
          console.error(err);
          this.cityDesriptionErrorMsg = `Current Wikipedia summary for ${this.getObjectFromList(this.selectedCity!, 'cities')!.name} is not currently available!`
          this.fetchingCityDescriptionData = false;
        }
      }));
      this.getCurrentWeather(city);
    }
  }

  private getCurrentWeather(city: any) {
    this.fetchingCurrentWeatherData = true;

    this.subscriptions.push(this.weatherService.getWeather(city.name).subscribe({
      next: (val) => {
        this.weather = val;
        this.fetchingCurrentWeatherData = false;
      },
      error: (err) => {
        console.error(err);
        this.currentWeatherErrorMsg = `Current weather for ${this.getObjectFromList(this.selectedCity!, 'cities')!.name} is not currently available!`
        this.fetchingCurrentWeatherData = false;
      }
    }));
  }

  weatherSelectionChange(weatherTypeId: number) {
    const weatherType = this.getObjectFromList(weatherTypeId, 'weatherTypes');
    if (weatherType !== undefined) {

    }
  }

  getObjectFromList(id: number, type: string) {
    return this.data[type]!.find(obj => obj.id === id)
  }

  clearCityInfo() {
    this.selectedCityDescription = '';
  }
}
