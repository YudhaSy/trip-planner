import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InformationDisplayComponent } from './components/information-display/information-display.component';
import { CityInfoComponent } from './components/city-info/city-info.component';
import { CityWeatherComponent } from './components/city-weather/city-weather.component';

@NgModule({
  declarations: [
    AppComponent,
    InformationDisplayComponent,
    CityInfoComponent,
    CityWeatherComponent
  ],
  imports: [
    BrowserModule,
    NgSelectModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
