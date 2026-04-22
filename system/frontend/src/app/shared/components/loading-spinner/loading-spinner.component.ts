import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule],
  template: `
    <div class="overlay" *ngIf="visible">
      <mat-spinner [diameter]="diameter" />
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() visible = false;
  @Input() diameter = 50;
}