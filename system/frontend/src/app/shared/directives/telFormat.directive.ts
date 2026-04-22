import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[telFormat]',
  standalone: true
})
export class TelFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let numbers = event.target.value.replace(/\D/g, '')

    if(numbers.length > 2){
      numbers =  '(' + numbers.substring(0, 2) + ') ' + numbers.substring(2)
    }

    if(numbers.length > 9 && numbers.length < 14){
      numbers = numbers.substring(0, 9) + '-' + numbers.substring(9)
    }
    else if(numbers.length >= 14){
      // Esta nesse formato (11) 99999-9999 e eu quero que fique nesse formato (11) 9 9999-9999
      numbers = numbers.substring(0, 6) + ' ' + numbers.substring(6 , 10) + '-' + numbers.substring(10)
    }
    
    event.target.value = numbers
  }

}
