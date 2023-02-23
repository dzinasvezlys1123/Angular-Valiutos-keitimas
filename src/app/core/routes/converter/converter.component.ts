import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, catchError, from, merge, of, startWith } from 'rxjs';
import { OpenRatesExchangeService } from 'src/app/open-rates-exchange/services/open-rates-exchange.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit, AfterViewInit {
  fromEntries: any[] = [];
  toEntries: any[] = [];
  currencies: any[] = [];
  location: any;
  from!: FormControl;
  to!: FormControl;
  rate: any  = null;
  loading: boolean = false;
  change!: BehaviorSubject<{
    from: {
      code: string,
      decimal_digits: number
    },
    to: {
      code: string,
      decimal_digits: number
    }
  }>;
  selected: any = {
    from: '',
    to: ''
  };


  constructor(
    private openRatesExchangeService: OpenRatesExchangeService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currencies = this.route.snapshot.data['currencies'] || [];
    this.fromEntries = this.route.snapshot.data['currencies'] || [];
    this.toEntries = this.route.snapshot.data['currencies'] || []; 
    
    this.change = new BehaviorSubject<{
      from: {
        code: string,
        decimal_digits: number
      },
      to: {
        code: string,
        decimal_digits: number
      }
    }>({
      from: {
        code: this.currencies.filter(c => c.code === 'USD')[0].code,
        decimal_digits: this.currencies.filter(c => c.code === 'USD')[0].decimal_digits
      },
      to: {
        code: this.currencies.filter(c => c.code === 'EUR')[0].code,
        decimal_digits: this.currencies.filter(c => c.code === 'EUR')[0].decimal_digits
      }
    });
     
      
    this.location = this.route.snapshot.data['location'] || {};
    
    

    this.from = new FormControl(null);

    this.to = new FormControl(
      {
        currency: this.currencies.filter(item => item['code'] === this.change.value.to.code)[0],
        amount: null
      }
    );

    const fromArray = this.fromEntries.slice();
    fromArray.splice(fromArray.indexOf(this.currencies.filter(item => item['code'] === this.change.value.to.code)[0]), 1);
    
    this.fromEntries = fromArray;

    this.from.valueChanges.subscribe(data => {
      this.loading = true;
      
      const toArr = this.toEntries.slice();
      toArr.splice(toArr.indexOf(data.currency), 1);
      this.toEntries = toArr;
      
      if (data.currency.code !== this.selected.from) {
        this.selected.from = data.currency.code;
        this.change.next({
          ...this.change.value,
          from: {
            ...this.change.value.from,
            code: data.currency.code
          }
        });
      }
      this.openRatesExchangeService.convert({
        amount: data.amount.toString(),
        from: data.currency.code,
        to: this.to.value.currency.code
      }).pipe(
        catchError(error => {
          this.loading = false;
          return of();
        }),
      ).subscribe(data => {
        this.to.setValue({
          ...this.to.value,
          amount: data.rates[this.to.value.currency.code].toFixed(this.to.value.currency.decimal_digits)
        }, {emitEvent: false});
        this.loading = false;
      });
    });

    this.to.valueChanges.subscribe(data => {
      this.loading = true;

      const fromArr = this.fromEntries.slice();
      fromArr.splice(fromArr.indexOf(data.currency), 1);
      
      this.fromEntries = fromArr;

      if (data.currency.code !== this.selected.to) {
        this.selected.to = data.currency.code;
        this.change.next({
          ...this.change.value,
          to: {
            ...this.change.value.to,
            code: data.currency.code
          }
        });
      }
      this.openRatesExchangeService.convert({
        amount: data.amount.toString(),
        from: data.currency.code,
        to: this.from.value.currency.code
      }).pipe(
        catchError(error => {
          this.loading = false;
          return of();
        }),
      ).subscribe(data => {
        this.from.setValue({
          ...this.from.value,
          amount: data.rates[this.from.value.currency.code].toFixed(this.from.value.currency.decimal_digits)
        }, {emitEvent: false});
        this.loading = false;
      });     
    });

    this.from.setValue(
      {
        currency: this.currencies.filter(item => item['code'] === this.location.country.currency).length > 0 ?
        this.currencies.filter(item => item['code'] === this.location.country.currency)[0] :
        this.currencies.filter(item => item['code'] === this.change.value.from.code)[0],
        amount: 1
      }
    );
  }

  ngAfterViewInit(): void {
    // merge(this.from, this.to).pipe(
    //   startWith({})
    // ).subscribe(data => {
    //   console.log(data);
    //   switch (data.key) {
    //     case 'from':
    //       
    //       break;
      
    //     default:
    //       break;
    //   }
    // });
  }

}
