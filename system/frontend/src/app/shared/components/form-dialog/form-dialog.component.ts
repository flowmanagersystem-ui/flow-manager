import { Component, ComponentFactoryResolver, Inject, Input, ViewChild, ViewContainerRef } from '@angular/core';

// Importes Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    // Importes Angular Material
    MatCardModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss'
})
export class FormDialogComponent {
  title: string
  subtitle: string 
  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true }) dynamicComponent!: ViewContainerRef

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private viewContainerRef: ViewContainerRef,
    private dialogRef: MatDialogRef<FormDialogComponent>
  ) {
    this.title = data.title
    this.subtitle = data.subtitle
  }

  ngOnInit() {
    if (this.data && this.data.component) {
      this.viewContainerRef.createComponent(this.data.component)
    }
  }
}
