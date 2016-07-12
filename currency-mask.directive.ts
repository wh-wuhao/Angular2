import {
  Directive, Output, EventEmitter, SimpleChange, Input
} from '@angular/core';
import { NgControl } from '@angular/common';

@Directive({
  selector: '[ngModel][currency-mask]',
  host: {
    //'(keydown)': 'onInputChange()',
    //'(ngModelChange)': 'onInputChange($event)',
  },
})
export class CurrencyMaskDirective {
  private model: NgControl;
  private currency: string = '$';
  @Input() modify: any;

  constructor(private model: NgControl) {
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    console.log("ngOnChanges" + this.model.value);
    // Use the hidden property "this.model.model", For some reason, "this.model.value" does not always contains the value,
    //noinspection TypeScriptUnresolvedVariable
    let currentValue = this.model.model;

    if (!currentValue) {
      return;
    }

    if (!(typeof currentValue === 'string' || currentValue instanceof String)) {
      currentValue = currentValue.toString();
    }
    // remove all mask characters (keep only numeric)
    let modelValue = currentValue.replace(/\D/g, '');
    // todo: remove the leading '0'
    let maskedValue = this.getMaskedValue(modelValue);

    /*
      This is the actual binding (unmasked model) value
      Angular is not happy with changing the binding during the change detection round. 
      workaround with setTimeout() so that it happened in another round of change detection.
     */
    setTimeout(()=> {
      this.model.viewToModelUpdate(modelValue); //this will trigger ngModelChange
    });


    // This is the displaying (masked) value
    this.model.valueAccessor.writeValue(maskedValue);
  }

  // Returns the masked value
  getMaskedValue(rawValue: string): string {
    let result: string = rawValue;
    
    if (result) {
      let i = result.length;
      while (i > 3) {
        i = i - 3;
        result = result.slice(0, i) + ',' + result.slice(i);
      }
      result = this.currency + result;
    }

    return result;
  }
}