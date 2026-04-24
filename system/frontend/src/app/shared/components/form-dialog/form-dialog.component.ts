import { Component, ComponentFactoryResolver, Inject, Input, ViewChild, ViewContainerRef } from '@angular/core';

// Importes Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export enum ModoFormT {
  CRIAR = 'criar',
  EDITAR = 'editar'
}

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
export class FormDialogComponent <T = any> {
  title: string
  subtitle: string 
  @ViewChild('dynamicComponent', { read: ViewContainerRef, static: true }) dynamicComponent!: ViewContainerRef

    static open<T>(dialog: MatDialog, data: { 
      title: string; 
      subtitle: string; 
      modo?: ModoFormT; 
      record?: T;
      component: any 
    }) {
      const isMobile = window.matchMedia('(max-width: 600px)').matches;

      return dialog.open(FormDialogComponent, {
        data,                    
        width: isMobile ? '100vw' : '600px',
        height: isMobile ? '100vh' : 'auto',
        // maxWidth: isMobile ? '100vw' : '80vw',
        // maxHeight: isMobile ? '100vh' : 'auto',
        panelClass: isMobile ? 'full-screen-dialog' : '',
        enterAnimationDuration: '400ms', 
        exitAnimationDuration: '300ms',  
      });
    }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { 
      record: T;            
      modo: ModoFormT;
      title: string;
      subtitle: string;
      component: any;
    },
    private viewContainerRef: ViewContainerRef,
    private dialogRef: MatDialogRef<FormDialogComponent>
  ) {
    this.title = data.title
    this.subtitle = data.subtitle
  }

  ngOnInit() {
    if (this.data?.component) {
      this.viewContainerRef.createComponent(this.data.component);
    }
  }
}
