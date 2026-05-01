import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[camelCase]',
  standalone: true,
})
export class CamelCaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    const input = this.el.nativeElement;
    const cursorPos = input.selectionStart ?? 0;

    input.value = this.toCamelCase(input.value);

    // Preserva a posição do cursor após a transformação
    input.setSelectionRange(cursorPos, cursorPos);
  }

  private toCamelCase(value: string): string {
    return value
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
  }
}