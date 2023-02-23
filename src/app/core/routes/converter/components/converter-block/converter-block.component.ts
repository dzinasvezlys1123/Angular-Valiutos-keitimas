import { Component, OnInit, Input, INJECTOR, Inject, Injector } from '@angular/core';
import { 
  FormControl, 
  Validators, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS, 
  ControlValueAccessor, 
  Validator,
  AbstractControl,
  ValidationErrors,
  NgControl
} from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { merge, Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-converter-block',
  templateUrl: './converter-block.component.html',
  styleUrls: ['./converter-block.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: ConverterBlockComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ConverterBlockComponent
    }
  ]
})
export class ConverterBlockComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() label: string = 'Select';
  @Input() items: any[] = [];

  control!: FormControl;

  value!: {
    currency: any,
    amount: number
  };

  touched: boolean = false;

  disabled: boolean = false;

  onChange = (files: any) => {};

  onTouched = () => {};

  constructor(@Inject(INJECTOR) public injector: Injector) { }

  ngOnInit(): void {
    this.control = (this.injector.get(NgControl).control as FormControl);
    
    // this.control.valueChanges.subscribe((value: any) => {
    //   console.log(value);
      
    // });
  }

  writeValue(obj: any): void {        
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value !== undefined) {
      return {
        empty: {
          value: value
        }
      };
    }
    return null;
  }

  handleCurrencyChange(event: MatOptionSelectionChange) {
    this.value.currency = event;
    this.onChange(this.value);
  }

  handleAmountChange(event: Event) {
    this.value.amount = Number.parseFloat((event.target as HTMLInputElement).value);
    this.onChange(this.value);
  }

}
