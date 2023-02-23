import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatMoneyPipe } from './pipes/format-money.pipe';



@NgModule({
  declarations: [
    FormatMoneyPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormatMoneyPipe
  ]
})
export class UtilsModule { }
