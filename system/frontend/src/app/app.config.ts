import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { MatPaginatorIntl } from '@angular/material/paginator';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { GetPortuguesePaginatorIntl } from './shared/services/portuguese-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),    
    provideHttpClient(),
    { provide: MatPaginatorIntl, useClass: GetPortuguesePaginatorIntl }
  ]
};
