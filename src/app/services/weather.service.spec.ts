import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Weather } from '../models/weather';
import { WeatherService } from './weather.service';
import { WeatherTypeEnum } from '../enums/weatherTypeEnum';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });

    service = TestBed.inject(WeatherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch current weather data', () => {
    const cityName = 'Calgary';
    const weatherType = WeatherTypeEnum.Current;
    const mockWeatherData =
    {
      weather: [
        {
          "id": 804,
          "main": "Clouds",
          "description": "overcast clouds",
          "icon": "04d"
        }
      ],
      "main": {
        "temp": 4.07,
        "feels_like": 0.98,
        "temp_min": 0.97,
        "temp_max": 7.63,
        "pressure": 1021,
        "humidity": 75
      },
      "dt": 1710603972
    };

    service.getWeather(cityName, weatherType).subscribe((weather: Weather) => {
      expect(weather.currentTemp).toEqual('5');
      expect(weather.feelsLike).toEqual('1'); 
      expect(weather.minTemp).toEqual('1'); 
      expect(weather.maxTemp).toEqual('8'); 
      expect(weather.humidity).toEqual('75');
      expect(weather.description).toEqual('Overcast clouds');
    });

    const req = httpTestingController.expectOne(
      `https://api.openweathermap.org/data/2.5/${weatherType}?q=${cityName}&units=metric&appid=${service.apiKey}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(mockWeatherData);
  });

  it('should fetch forecast weather data', () => {
    const cityName = 'Calgary';
    const weatherType = WeatherTypeEnum.Forecast;
    const mockWeatherData =
    {
      "list": [
        {
          "dt": 1711033200,
          "main": {
            "temp": -2.14,
            "feels_like": -7.53,
            "temp_min": -2.14,
            "temp_max": -2.14,
            "pressure": 1022,
            "sea_level": 1022,
            "grnd_level": 897,
            "humidity": 89,
            "temp_kf": 0
          },
          "weather": [
            {
              "id": 600,
              "main": "Snow",
              "description": "light snow",
              "icon": "13n"
            }
          ],
          "dt_txt": "2024-03-21 09:00:00"
        },
        {
          "dt": 1711044000,
          "main": {
            "temp": -2.26,
            "feels_like": -7.81,
            "temp_min": -2.26,
            "temp_max": -2.26,
            "pressure": 1021,
            "sea_level": 1021,
            "grnd_level": 896,
            "humidity": 89,
            "temp_kf": 0
          },
          "weather": [
            {
              "id": 600,
              "main": "Snow",
              "description": "light snow",
              "icon": "13n"
            }
          ],
          "dt_txt": "2024-03-21 12:00:00"
        }
      ]
    };

    service.getWeather(cityName, weatherType).subscribe((weather: Weather) => {
      expect(weather.forecastList.length).toBe(1); // for simplicity, we just going to generate 1 in the list
      expect(weather.forecastList[0].currentTemp).toEqual('-2');
      expect(weather.forecastList[0].feelsLike).toEqual('-7'); 
      expect(weather.forecastList[0].minTemp).toEqual('-2'); 
      expect(weather.forecastList[0].maxTemp).toEqual('-2'); 
      expect(weather.forecastList[0].humidity).toEqual('89');
      expect(weather.forecastList[0].description).toEqual('Light snow');
    });

    const req = httpTestingController.expectOne(
      `https://api.openweathermap.org/data/2.5/${weatherType}?q=${cityName}&units=metric&appid=${service.apiKey}`
    );
    expect(req.request.method).toEqual('GET');

    req.flush(mockWeatherData);
  });
});
