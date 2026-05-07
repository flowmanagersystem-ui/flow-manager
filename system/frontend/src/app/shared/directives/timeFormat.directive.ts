import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[timeFormat]',
  standalone: true
})
export class TimeFormatDirective {

  /**
   * true  => HH:mm
   * false => mm:ss
   */
  @Input() useHours: boolean = true;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {

    // let totalSeconds = event.target.value.replace(/\D/g, '');

    // const minutes = Math.floor(totalSeconds / 60)
    // const seconds = totalSeconds % 60

    // return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

    let numbers = event.target.value.replace(/\D/g, '');

    // Limita a 4 dígitos
    numbers = numbers.substring(0, 4);

    let formatted = '';

    if (numbers.length <= 2) {
      formatted = numbers;
    } else {
      formatted =
        numbers.substring(0, 2) +
        ':' +
        numbers.substring(2);
    }

    // Validação simples
    if (this.useHours && formatted.length === 5) {
      let [hh, mm] = formatted.split(':');

      let hours = Math.min(parseInt(hh, 10), 23);
      let minutes = Math.min(parseInt(mm, 10), 59);

      formatted =
        hours.toString().padStart(2, '0') +
        ':' +
        minutes.toString().padStart(2, '0');
    }

    // Para minutos e segundos
    if (!this.useHours && formatted.length === 5) {
      let [mm, ss] = formatted.split(':');

      let minutes = Math.min(parseInt(mm, 10), 59);
      let seconds = Math.min(parseInt(ss, 10), 59);

      formatted =
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');
    }

    event.target.value = formatted;
  }
}