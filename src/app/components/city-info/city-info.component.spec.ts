import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CityInfoComponent } from './city-info.component';
import { WikipediaService } from '../../services/wikipedia.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CityInfoComponent', () => {
  let component: CityInfoComponent;
  let fixture: ComponentFixture<CityInfoComponent>;
  let wikipediaServiceStub: Partial<WikipediaService>;

  beforeEach(async () => {
    wikipediaServiceStub = {
      getCityDescription: jasmine.createSpy('getCityDescription').and.returnValue(of('Mock city description'))
    };

    await TestBed.configureTestingModule({
      declarations: [CityInfoComponent],
      providers: [{ provide: WikipediaService, useValue: wikipediaServiceStub }],
      schemas: [NO_ERRORS_SCHEMA] // Use NO_ERRORS_SCHEMA to ignore unknown elements and attributes so we don't need to mock them
    }).compileComponents();

    fixture = TestBed.createComponent(CityInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit selected city name on citySelectionChange', () => {
    const cityName = 'Calgary';
    spyOn(component.cityNameChange, 'emit');

    component.citySelectionChange(1); // Select Calgary

    expect(component.cityNameChange.emit).toHaveBeenCalledWith(cityName);
  });

  it('should fetch city description on citySelectionChange', () => {
    const cityName = 'Calgary';

    component.citySelectionChange(1); // Select Calgary

    expect(wikipediaServiceStub.getCityDescription).toHaveBeenCalledWith(cityName);
    expect(component.cityInfo).toEqual('Mock city description');
    expect(component.fetchingData).toBe(false);
  });

  it('should clear city info on clearCityInfo', () => {
    component.cityInfo = 'Mock city description';
    spyOn(component.cityNameChange, 'emit');

    component.clearCityInfo();

    expect(component.cityInfo).toBeNull();
    expect(component.cityNameChange.emit).toHaveBeenCalledWith(null);
  });
});
