// Angular
import { Component, inject, OnInit } from '@angular/core';
import { RouterLinkActive, RouterLink, RouterOutlet } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTooltip } from "@angular/material/tooltip";

// Services
import { BreadcrumbService } from '../breadcrumb.service';
import { ThemeService } from '../../../shared/services/theme.service';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    // Angular
    RouterLinkActive,
    FormsModule,
    CommonModule,
    RouterLink,
    RouterOutlet,
    // Angular Material
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTooltip
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit{
  public themeService = inject(ThemeService)

  userName: string = 'Admin Demo';
  role: string = 'Administrator';
  themeIcon: string = 'light_mode';
  toggleSidebar: boolean = true;
  toggleSidebarIcon: string = 'arrow_back_ios';
  year: number = new Date().getFullYear();

  constructor(public breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    const currentcolorTheme = this.themeService.getPreferredColorTheme()

    this.themeService.setColorTheme(currentcolorTheme)

    if(window.innerWidth <= 768){
      this.toggleSidebar = false;
      this.toggleSidebarIcon = 'arrow_forward_ios';
    }
  }

  toggleTheme() {
    if(this.themeService.getPreferredColorTheme() == 'light'){      
      this.themeIcon = 'light_mode'
    }
    else{      
      this.themeIcon = 'dark_mode'
    }

    this.themeService.toggleColorTheme()
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
