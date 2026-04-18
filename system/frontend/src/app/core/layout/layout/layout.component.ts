import { Component } from '@angular/core';
import { RouterLinkActive, RouterLink, RouterOutlet } from "@angular/router";

import {MatDrawerMode, MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BreadcrumbService } from '../breadcrumb.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [    
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    RouterLinkActive,
    FormsModule,
    CommonModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  userName: string = 'Admin Demo';
  role: string = 'Administrator';
  theme: string = 'light_mode';
  toggleSidebar: boolean = true;
  toggleSidebarIcon: string = 'arrow_back_ios';
  year: number = new Date().getFullYear();

  constructor(public breadcrumbService: BreadcrumbService) {}

  toggleTheme() {
    if (this.theme === 'light_mode') {
      this.theme = 'dark_mode';
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      this.theme = 'light_mode';
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }

  onToggleSidebar() {
    if (this.toggleSidebar) {
      this.toggleSidebar = false;
      this.toggleSidebarIcon = 'arrow_back_ios';
      
    }
    else {
      this.toggleSidebar = true;
      this.toggleSidebarIcon = 'arrow_forward_ios';
    }
  }

}
