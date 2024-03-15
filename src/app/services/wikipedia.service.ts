import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WikipediaService {

  constructor(private http: HttpClient) { }

  getCityDescription(cityName: string): Observable<string> {
    const apiUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=extracts&exintro=true&redirects=true&titles=${cityName}`;

    return this.http.get(apiUrl).pipe(
      map((response: any) => {
        const pages = response.query.pages;
        const pageId = Object.keys(pages)[0]; // Extracting the page ID
        return pages[pageId].extract; // Extracting the description from the response
      })
    );
  }
}
