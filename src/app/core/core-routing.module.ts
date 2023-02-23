import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeolocatorResolver } from '../geolocator/resolvers/geolocator.resolver';
import { GetCurrenciesResolver } from '../open-rates-exchange/resolvers/get-currencies.resolver';
import { ConverterComponent } from './routes/converter/converter.component';
import { RatesComponent } from './routes/rates/rates.component';

const routes: Routes = [
  {
    path: '',
    component: ConverterComponent,
    title: 'Converter |  Converter',
    resolve: {
      currencies: GetCurrenciesResolver,
      location: GeolocatorResolver
    }
  },
  {
    path: 'rates',
    component: RatesComponent,
    title: 'Rates | Converter',
    resolve: {
      currencies: GetCurrenciesResolver,
      location: GeolocatorResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
