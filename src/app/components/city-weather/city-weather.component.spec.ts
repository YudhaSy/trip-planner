import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityWeatherComponent } from './city-weather.component';
import { Weather } from '../../models/weather';
import { WeatherService } from '../../services/weather.service';
import { WeatherTypeEnum } from '../../enums/weatherTypeEnum';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CityWeatherComponent', () => {
  let component: CityWeatherComponent;
  let fixture: ComponentFixture<CityWeatherComponent>;
  let weatherServiceStub: Partial<WeatherService>;

  beforeEach(async () => {
    weatherServiceStub = {
      getWeather: jasmine.createSpy('getWeather').and.returnValue(of({} as Weather))
    };

    await TestBed.configureTestingModule({
      declarations: [CityWeatherComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Use NO_ERRORS_SCHEMA to ignore unknown elements and attributes so we don't need to mock them 
    }).compileComponents();

    fixture = TestBed.createComponent(CityWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set cityName and fetch current weather data', () => {
    const cityName = 'Test City';
    component.cityName = cityName;

    expect(component._cityName).toBe(cityName);
    expect(weatherServiceStub.getWeather).toHaveBeenCalledWith(cityName, WeatherTypeEnum.Current);
  });

  it('should fetch forecast weather data', () => {
    const cityName = 'TestCity';
    const todaysDate = new Date();
    const tomorrowsDate = new Date(todaysDate.getTime() + (24 * 60 * 60 * 1000)); // Adding milliseconds for one day for tomorrow
    component.bsValue = tomorrowsDate;
    component.minDate = todaysDate;
    component._cityName = cityName;
    component.forecastWeatherDataList = []; // Clear forecast data initially

    const mockWeather: Weather = {
      date: new Date(),
      iconUrl: 'mock-icon-url',
      currentTemp: 'mock-current-temp',
      feelsLike: 'mock-feels-like',
      minTemp: 'mock-min-temp',
      maxTemp: 'mock-max-temp',
      humidity: 'mock-humidity',
      description: 'mock-description',
      forecastList: []
    };
    (weatherServiceStub.getWeather as jasmine.Spy).and.returnValue(of({ forecastList: [mockWeather] }));

    component.handleWeatherByDateChange();

    expect(weatherServiceStub.getWeather).toHaveBeenCalledWith(cityName, WeatherTypeEnum.Forecast);
    expect(component.fetchingData).toBe(false);
  });

  it('should handle current weather by date change', () => {
    const cityName = 'Test City';
    const bsValue = new Date();
    component.bsValue = bsValue;
    component._cityName = cityName;
    component.currentWeatherData = null;

    component.handleWeatherByDateChange();

    expect(weatherServiceStub.getWeather).toHaveBeenCalledWith(cityName, WeatherTypeEnum.Current);
  });

  it('should get forecast display data', () => {
    const bsValue = new Date();
    const forecastWeatherDataList: Weather[] = [
      { date: bsValue, iconUrl: '', currentTemp: '', feelsLike: '', minTemp: '', maxTemp: '', humidity: '', description: '', forecastList: [] }
    ];
    component.bsValue = bsValue;
    component.forecastWeatherDataList = forecastWeatherDataList;

    component.getForecastDisplayData();

    expect(component.weather).toEqual(forecastWeatherDataList[0]);
  });
});
