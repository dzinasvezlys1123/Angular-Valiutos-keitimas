import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeolocatorService {

  private readonly baseApiUrl: string = 'https://api.geoapify.com/v1/ipinfo';

  constructor(private http: HttpClient) { }

  getCurrentLocation(): Observable<any> {
    return this.http.get<any>(
      this.baseApiUrl,
      {
        params: {
          apiKey: environment.geoKey
        }
      }
    ).pipe(
      catchError(error => {
        return of({});
      })
    );
  }
}
