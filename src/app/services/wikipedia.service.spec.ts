import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WikipediaService } from './wikipedia.service';

describe('WikipediaService', () => {
  let service: WikipediaService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WikipediaService]
    });
    service = TestBed.inject(WikipediaService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch city description', () => {
    const cityName = 'Calgary';
    const mockDescription = 'Calgary is a city in Alberta, Canada.';

    service.getCityDescription(cityName).subscribe((description: string) => {
      expect(description).toEqual(mockDescription);
    });

    const req = httpTestingController.expectOne(
      `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${cityName}`
    );
    expect(req.request.method).toEqual('GET');

    const mockResponse = {
      query: {
        pages: {
          123456: {
            extract: mockDescription
          }
        }
      }
    };
    req.flush(mockResponse);
  });
});
