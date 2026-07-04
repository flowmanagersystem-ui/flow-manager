import { Injectable } from '@angular/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';

@Injectable()
export class PortugueseDatepickerIntl extends MatDatepickerIntl {

  override calendarLabel = 'Calendário';

  override openCalendarLabel = 'Abrir calendário';

  override prevMonthLabel = 'Mês anterior';

  override nextMonthLabel = 'Próximo mês';

  override prevYearLabel = 'Ano anterior';

  override nextYearLabel = 'Próximo ano';

  override prevMultiYearLabel = '21 anos anteriores';

  override nextMultiYearLabel = 'Próximos 21 anos';

  override switchToMonthViewLabel = 'Mudar para visão mensal';

  override switchToMultiYearViewLabel = 'Escolher mês e ano';
}