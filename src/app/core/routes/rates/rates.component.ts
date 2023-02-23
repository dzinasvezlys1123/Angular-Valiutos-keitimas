import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OpenRatesExchangeService } from '../../../open-rates-exchange/services/open-rates-exchange.service';

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.scss']
})
export class RatesComponent implements OnInit {

  currencies: any[] = [];
  location: any;
  baseCurrency!: FormControl;
  rates: any[] = [];
  loading: boolean = false;

  constructor(
    private openExchangeRatesSerive: OpenRatesExchangeService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currencies = this.route.snapshot.data['currencies'] || []; 

    this.baseCurrency = new FormControl();

    this.location = this.route.snapshot.data['location'] || {};

    this.baseCurrency.valueChanges.subscribe(value => {
      this.loading = true;
      this.openExchangeRatesSerive.getRates({from: value.code}).subscribe(rates => {       
        this.rates = rates;
        this.loading = false;
      });
    });

    this.baseCurrency.setValue(
      this.currencies.filter(item => item['code'] === this.location.country.currency).length > 0 ?
      this.currencies.filter(item => item['code'] === this.location.country.currency)[0] :
      this.currencies.filter(item => item['code'] === 'USD')[0],
    );
  }

}
