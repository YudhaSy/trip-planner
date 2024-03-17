import { Component, EventEmitter, Output } from '@angular/core';
import { Select } from '../../models/select';
import { Subscription } from 'rxjs';
import { WikipediaService } from '../../services/wikipedia.service';

@Component({
  selector: 'app-city-info',
  templateUrl: './city-info.component.html',
  styleUrl: './city-info.component.css'
})
export class CityInfoComponent {
  @Output() cityNameChange = new EventEmitter<string | null>();

  errorMsg: string | null = null;
  fetchingData: boolean = false;
  cityInfo: string | null = null;
  cities: Select[] = [
    { id: 1, name: 'Calgary' },
    { id: 2, name: 'Edmonton' },
    { id: 3, name: 'Vancouver' },
    { id: 4, name: 'Toronto' },
    { id: 5, name: 'Montreal' }
  ];
  selectedCity: number | null = null;
  subscriptions: Subscription[] = [];

  constructor(private wikipediaService: WikipediaService) { }

  ngOnDestroy() {
    // This ensures that any ongoing subscriptions are terminated when the component is destroyed, preventing memory leaks.
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // handles ng-select selection and get necessary data from the selection
  citySelectionChange(cityId: number) {
    const city = this.getCityFromCities(cityId);

    if (city !== undefined) {
      this.fetchingData = true;
      this.errorMsg = null;
      this.cityNameChange.emit(city.name);

      this.subscriptions.push(this.wikipediaService.getCityDescription(city.name).subscribe({
        next: (val) => {
          this.cityInfo = val;
          this.fetchingData = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = `Wikipedia summary for ${this.getCityFromCities(this.selectedCity!)!.name} is not currently available!`
          this.fetchingData = false;
        }
      }));
    }
  }

  // helper method to get city object from city list
  getCityFromCities(id: number) {
    return this.cities.find(obj => obj.id === id);
  }

  clearCityInfo() {
    this.cityInfo = null;
    this.cityNameChange.emit(null);
  }
}
