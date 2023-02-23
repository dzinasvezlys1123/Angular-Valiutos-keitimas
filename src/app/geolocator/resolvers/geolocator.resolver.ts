import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { GeolocatorService } from '../services/geolocator.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocatorResolver implements Resolve<any> {

  constructor(private geoLocatorService: GeolocatorService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.geoLocatorService.getCurrentLocation();
  }
}
