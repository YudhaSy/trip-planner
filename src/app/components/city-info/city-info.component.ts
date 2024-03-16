import { Component, EventEmitter, Output } from '@angular/core';
import { Select } from '../../models/select';
import { Subscription } from 'rxjs';
import { WikipediaService } from '../../services/wikipedia.service';
import { DisplayData } from '../../models/displayData';
import { DisplayType } from '../../enums/displayType';

@Component({
  selector: 'app-city-info',
  templateUrl: './city-info.component.html',
  styleUrl: './city-info.component.css'
})
export class CityInfoComponent {
  @Output() cityNameChange = new EventEmitter<string | null>();

  data: DisplayData = {
    fetchingData: false,
    type: DisplayType.Info,
    cityInfo: null,
    errorMsg: null
  };
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

  citySelectionChange(cityId: number) {
    const city = this.getCityFromCities(cityId);

    if (city !== undefined) {
      this.data.fetchingData = true;
      this.data.errorMsg = null;
      this.cityNameChange.emit(city.name);

      this.subscriptions.push(this.wikipediaService.getCityDescription(city.name).subscribe({
        next: (val) => {
          this.data.cityInfo = val;
          this.data.fetchingData = false;
        },
        error: (err) => {
          console.error(err);
          this.data.errorMsg = `Wikipedia summary for ${this.getCityFromCities(this.selectedCity!)!.name} is not currently available!`
          this.data.fetchingData = false;
        }
      }));
    }
  }

  getCityFromCities(id: number) {
    return this.cities.find(obj => obj.id === id);
  }

  clearCityInfo() {
    this.data.cityInfo = null;
    this.cityNameChange.emit(null);
  }
}
