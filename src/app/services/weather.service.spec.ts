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
    // After each test, verify that there are no outstanding requests
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch current weather data', () => {
    const cityName = 'Calgary';
    const weatherType = WeatherTypeEnum.Current;
    const mockWeatherData = {
      // Mock weather data response
      main: {
        temp: 20, // Mock temperature
        feels_like: 18, // Mock feels like temperature
        temp_min: 15, // Mock min temperature
        temp_max: 25, // Mock max temperature
        humidity: 50 // Mock humidity
      },
      weather: [
        {
          description: 'Clear sky' // Mock weather description
        }
      ]
    };

    // Subscribe to the service method
    service.getWeather(cityName, weatherType).subscribe((weather: Weather) => {
      // Assertion: Ensure that the returned weather object matches the expected structure
      expect(weather.currentTemp).toEqual('20'); // Verify temperature
      expect(weather.feelsLike).toEqual('18'); // Verify feels like temperature
      expect(weather.minTemp).toEqual('15'); // Verify min temperature
      expect(weather.maxTemp).toEqual('25'); // Verify max temperature
      expect(weather.humidity).toEqual('50'); // Verify humidity
      expect(weather.description).toEqual('Clear sky'); // Verify weather description
    });

    // Mock HTTP request
    const req = httpTestingController.expectOne(
      `https://api.openweathermap.org/data/2.5/${weatherType}?q=${cityName}&units=metric&appid=${service.apiKey}`
    );
    expect(req.request.method).toEqual('GET'); // Ensure that the request is of type GET

    // Respond with mock weather data
    req.flush(mockWeatherData);
  });
});
