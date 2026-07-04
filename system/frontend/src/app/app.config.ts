import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

import { GetPortuguesePaginatorIntl } from './shared/services/portuguese-paginator-intl';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { PortugueseDatepickerIntl } from './shared/services/portuguese-datepicker-intl';
import { jwtInterceptor } from './core/auth/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimationsAsync(),    
    provideHttpClient(withInterceptors([jwtInterceptor])),
    { provide: MatPaginatorIntl, useClass: GetPortuguesePaginatorIntl },
    
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },

    provideNativeDateAdapter(),

    { provide: MatDatepickerIntl, useClass: PortugueseDatepickerIntl }

  ]
};
