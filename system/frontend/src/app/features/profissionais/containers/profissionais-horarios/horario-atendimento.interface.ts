export interface HorarioAtendimento {
  id?: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFim: string;
}

export enum DiaSemana {
    SEG = 'SEG',
    TER = 'TER',
    QUA = 'QUA',
    QUI = 'QUI',
    SEX = 'SEX',
    SAB = 'SAB',
    DOM = 'DOM'
}