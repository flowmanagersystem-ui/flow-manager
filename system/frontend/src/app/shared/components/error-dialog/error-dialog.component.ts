import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

export interface ErrorDialogData {
  message: string
  redirectTo?: string
}

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
  ],
  templateUrl: './error-dialog.component.html',
  styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
  message: string;
  redirectTo?: string;

  static open(dialog: MatDialog, data: { message: string; redirectTo?: string }) {  
    return dialog.open(ErrorDialogComponent, {
      data,                    
      enterAnimationDuration: '400ms', 
      exitAnimationDuration: '300ms',  
    });
  }


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ErrorDialogComponent>
  ) {
    this.message = data.message;
    this.redirectTo = data.redirectTo;  
  }
}