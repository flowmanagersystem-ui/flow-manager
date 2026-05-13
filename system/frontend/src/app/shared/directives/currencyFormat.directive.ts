import {
  Directive,
  ElementRef,
  forwardRef,
  HostListener
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Directive({
  selector: '[currencyFormat]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyFormatDirective),
      multi: true
    }
  ]
})
export class CurrencyFormatDirective implements ControlValueAccessor {

  private onChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  /**
   * Valor vindo do form -> input
   */
  writeValue(value: number | null): void {

    if (value === null || value === undefined) {
      this.el.nativeElement.value = '';
      return;
    }

    this.el.nativeElement.value = this.format(value);
  }

  /**
   * Registra mudança
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registra touched
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Desabilita input
   */
  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  /**
   * Digitação
   */
  @HostListener('input', ['$event'])
  onInput(event: any): void {

    let value = event.target.value.replace(/\D/g, '');

    if (!value) {
      this.el.nativeElement.value = '';
      this.onChange(null);
      return;
    }

    // valor REAL
    const numericValue = Number(value) / 100;

    // valor formatado
    this.el.nativeElement.value = this.format(numericValue);

    // envia valor limpo pro form
    this.onChange(numericValue);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }

  /**
   * Formatação BRL
   */
  private format(value: number): string {

    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}