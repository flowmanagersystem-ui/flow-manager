import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData,
    private dialogRef: MatDialogRef<ErrorDialogComponent>
  ) {}
}