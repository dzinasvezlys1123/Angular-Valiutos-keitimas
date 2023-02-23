import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartConfiguration } from 'chart.js';
import { BehaviorSubject, merge, startWith, catchError, of, map } from 'rxjs';
import { OpenRatesExchangeService, TimeSeriesResponse } from 'src/app/open-rates-exchange/services/open-rates-exchange.service';
import Chart from 'chart.js/auto';
import * as moment from 'moment';

Chart.defaults.color = "#fff";

@Component({
  selector: 'app-converter-graph',
  templateUrl: './converter-graph.component.html',
  styleUrls: ['./converter-graph.component.scss']
})
export class ConverterGraphComponent implements OnInit, AfterViewInit {

  public contentLength: number = 7;
  public controls: FormControl = new FormControl('week');
  @Input() change!: BehaviorSubject<{
    from: {
      code: string,
      decimal_digits: number
    },
    to: {
      code: string,
      decimal_digits: number
    }
  }>;

  moment = require('moment');

  chart!: Chart;
  @ViewChild('chart') chartRef!: ElementRef;

  constructor(private openExchangeRatesSerive: OpenRatesExchangeService) { }

  ngOnInit(): void {
    // console.log(Array.from({length: 24}, (_, index) => index));
  }

  ngAfterViewInit(): void {
    this.chart = new Chart(
      this.chartRef.nativeElement,
      {
        type: 'line',
        data: {
          labels: [],
          datasets: [],
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                      
                        let label = context.dataset.label || '';

                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: this.change.value.to.code, minimumFractionDigits: this.change.value.to.decimal_digits }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            },
          }
        },
      }
    )
    
    merge(this.change, this.controls.valueChanges).pipe(
      startWith({}),
      map(response => {
        
        let from = this.moment(new Date(this.moment().subtract('1', 'year'))).format('YYYY-MM-DD');
        switch (this.controls.value) {
          case 'week':
            from = this.moment(new Date(this.moment().subtract('1', 'week'))).format('YYYY-MM-DD');            
            break;

          case 'month':
            from = this.moment(new Date(this.moment().subtract('1', 'month'))).format('YYYY-MM-DD');
            break;
          case 'year':
            from = this.moment(new Date(this.moment().subtract('1', 'year'))).format('YYYY-MM-DD');
            break;
          case '5years':
            from = this.moment(new Date(this.moment().subtract('5', 'years'))).format('YYYY-MM-DD');
            break;

          case '5years':
            from = this.moment(new Date(this.moment().subtract('5', 'years'))).format('YYYY-MM-DD');
            break;
        
          default:
            from = this.moment(new Date(this.moment().subtract('1', 'year'))).format('YYYY-MM-DD');
            break;
        }

        let format: string = 'DD/MM';
        let title: string = '';

        this.getData(from, this.change.value).then((data) => {
          switch (this.controls.value) {
            case 'week':   
              title = 'Weekly Chart';           
              break;
            
            case 'month':
              title = 'Monthly Chart';   
              break;
            
            case 'year':
              title = 'Yearly Chart'; 
              break;

            case '5years':
              title = '5 Years Chart'; 
              break;
            default:
              break;
          }

          switch (this.controls.value) {
            case 'week':
            case 'month':
              let date = new Date(data.start_date);
              let labels: string[] = [
                this.moment(date).format(format)
              ];

              let dates: Date[] = [
                new Date(date)
              ];
              

              while (date < new Date(data.end_date)) {
                date.setDate(date.getDate() + 1);
                const newDate = new Date(date);
                
                dates.push(newDate);
              }

              this.chart.data.labels = dates.map(date => this.moment(date).format('DD/MM'));

              let dataset: any[] = [];

              dates.forEach(date => {                         
                const value = (data.rates[moment(new Date(date)).format('YYYY-MM-DD')] as any);
                dataset.push(value ? value[this.change.value.to.code] : undefined);                
              });
              
              

              this.chart.data.datasets = [{
                label: title,
                data: dataset.map(
                  (dataValue, index) => Number.parseFloat((dataValue !== undefined ? dataValue : dataset[index - 1] ? dataset[index - 1] : dataset[index - 2]).toFixed(this.change.value.to.decimal_digits))
                ),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1  
              }];

              this.chart.update();
              break;
            
            case 'year':
              // const MONTHS = () => {
              //   const months = [];
              //   const dateStart = moment(new Date(new Date().getFullYear(), 0, 1));
              //   const dateEnd = moment(new Date(new Date().getFullYear(), 0, 1)).add(12, 'month');
                
              //   while (dateEnd.diff(dateStart, 'months') > 0) {
              //    months.push([dateStart.format('MM'), dateStart.format('MMMM')]);
              //    dateStart.add(1, 'month');
              //   }
              //   return months
              // }
              
              let yearlyLabels = new Set(Object.keys(data.rates).map(key => {                
                if (new Date(key) < new Date(new Date(data.end_date).getFullYear(), new Date(data.end_date).getMonth(), 1)) {
                  const arr = key.split('-');
                  return `${arr[0]}-${arr[1]}`; 
                }
                return null;
              }).filter(key => key !== null));

              this.chart.data.labels = Array.from(yearlyLabels).map(date => this.moment(date).format('MM/YY'));

              let yearlyData: any[] = Array.from(yearlyLabels).map(label => {
                const keys = Object.keys(data.rates).filter(key =>  key.includes(label!));
                const values = keys.map(key => (data.rates[key] as any)[this.change.value.to.code]);
                const averageRate = Number.parseFloat((values.reduce((previous, current) => current += previous) / values.length).toFixed(this.change.value.to.decimal_digits));
                return averageRate;                                
              });

              this.chart.data.datasets = [{
                label: title,
                data: yearlyData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1  
              }];

              this.chart.update();
              break;
            
            case '5years':
              let yearLabels = new Set(Object.keys(data.rates).map(key => {                
                if (new Date(key) < new Date(new Date(data.end_date).getFullYear(), new Date(data.end_date).getMonth(), 1)) {
                  const arr = key.split('-');
                  return arr[0]; 
                }
                return null;
              }).filter(key => key !== null));
              this.chart.data.labels = Array.from(yearLabels);
              let yearData: any[] = Array.from(yearLabels).map(label => {
                const keys = Object.keys(data.rates).filter(key =>  key.includes(label!)); 
                let averageRate: number = 0;                
                if (label !== Array.from(yearLabels)[Array.from(yearLabels).length - 1]) {                 
                  const values = keys.map(key => (data.rates[key] as any)[this.change.value.to.code]);
                  averageRate = Number.parseFloat((values.reduce((previous, current) => current += previous) / values.length).toFixed(this.change.value.to.decimal_digits));
                } else {
                  averageRate = Number.parseFloat((data.rates[keys[keys.length - 1]] as any)[this.change.value.to.code].toFixed(this.change.value.to.decimal_digits));
                }
                return averageRate;                                
              });
              this.chart.data.datasets = [{
                label: title,
                data: yearData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1  
              }];

              this.chart.update();
              break;
            default:
              break;
          }
        }).catch((error) => {});
        return response;
      }),
      catchError(() => {
        return of();
      })
    ).subscribe(data => {});
  }

  getData(range: string, currencies: any): Promise<TimeSeriesResponse> {
    const comp = this;
    return new Promise<TimeSeriesResponse>((resolve, reject) => {
      comp.openExchangeRatesSerive.getTimeSeries(
        {
          from: currencies.from.code,
          to: currencies.to.code
        },
        {
          from: range
        }
      ).pipe(
        catchError(() => {
          reject();
          return of();
        })
      ).subscribe(data => {
        resolve(data);
      });
    })
  }

}
