import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { OpenRatesExchangeService } from '../services/open-rates-exchange.service';

@Injectable({
  providedIn: 'root'
})
export class GetCurrenciesResolver implements Resolve<any> {

  constructor(private openRatesExchange: OpenRatesExchangeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.openRatesExchange.getCurrencies();
  }
}
