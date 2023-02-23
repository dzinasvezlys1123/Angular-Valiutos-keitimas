import { Pipe, PipeTransform } from '@angular/core';
import * as currency from 'currency.js';


@Pipe({
  name: 'formatMoney'
})
export class FormatMoneyPipe implements PipeTransform { 

  transform(value: string, symbol='$'): unknown {    
    return currency(value, {symbol: symbol ,separator: ',' }).format();
  }

}
