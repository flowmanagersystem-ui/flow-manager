import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormValidations } from '../../forms-validations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mat-error',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './input-erro-msg.component.html',
  styleUrl: './input-erro-msg.component.scss'
})
export class InputErroMsgComponent {
  @Input() label!: string
  @Input() control!: FormControl


  get errorMessage(){
    for(let propertyName in this.control.errors){
      if(this.control.errors.hasOwnProperty(propertyName) && this.control.touched){
        return FormValidations.getErrorMsg(this.label, propertyName, this.control.errors[propertyName])
      }
    }

    return null
  }
}
