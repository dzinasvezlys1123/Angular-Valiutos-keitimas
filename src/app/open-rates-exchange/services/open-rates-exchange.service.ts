import { keyframes } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { toLowerKeys } from 'src/app/utils/functions/object-keys-to-lower.function';
import { environment } from 'src/environments/environment';


export interface ConversionResponse {
  amount: number;
  base: string;
  date: Date;
  rates: {[key: string]: number};
}

export interface TimeSeriesResponse {
  amount: number;
  base: string;
  start_date: Date;
  end_date: Date;
  rates: {[key: string]: number};
}

@Injectable({
  providedIn: 'root'
})
export class OpenRatesExchangeService {

  private readonly baseApiUrl: string = environment.apiUrl;
  private readonly worldCurrencies: any = require('../jsons/world_currency_symbols.json');

  constructor(private http: HttpClient) { }

  getCurrencies(): Observable<any> {
    
    return this.http.get<any>(
      this.baseApiUrl + 'currencies',
    ).pipe(
      map(response => {        
        const currencies = Object.keys(response).map(key => {          
          let obj = this.worldCurrencies[Object.keys(this.worldCurrencies).filter(_key => _key === key)[0]];
          if (obj) {
            obj = {
              ...toLowerKeys(obj),
              name: response[key]
            }
          }          
          return obj || {code: key, name: response[key]};
        });        
        
        return currencies;
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  convert(data: {
    from: string,
    to: string,
    amount: string
  }): Observable<ConversionResponse> {
    const url = new URL(this.baseApiUrl + 'latest');
    Object.keys(data).forEach(key => {
      url.searchParams.append(key, (data as any)[key])
    });
    return this.http.get<ConversionResponse>(url.toString()).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getTimeSeries(data: {from: string, to: string}, range: {from: string, to?: string}): Observable<TimeSeriesResponse> {
    const urlString: string = `${this.baseApiUrl}${range.from}..${range.to ? range.to : ''}`;
    const url = new URL(urlString);
    Object.keys(data).forEach(key => {
      url.searchParams.append(key, (data as any)[key])
    });
    return this.http.get<TimeSeriesResponse>(url.toString()).pipe(
      catchError(error => {
        throw error;
      })
    );
  }

  getRates(data: {from: string}): Observable<any> {
    return this.http.get<any>(
      this.baseApiUrl + 'latest',
      {
        params: data
      }
    ).pipe(
      map(response => {        
        const currencies = Object.keys(response.rates).map(key => {          
          let obj = this.worldCurrencies[Object.keys(this.worldCurrencies).filter(_key => _key === key)[0]];
          if (obj) {
            obj = {
              ...toLowerKeys(obj),
              rate: response.rates[key]
            }
          }          
          return obj || {code: key, name: response.rates[key]};
        });        
        
        return currencies;
      }),
      catchError(error => {
        return of();
      })
    );
  }
}
