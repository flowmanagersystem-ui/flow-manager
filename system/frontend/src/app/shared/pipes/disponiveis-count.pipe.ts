import { Pipe, PipeTransform } from "@angular/core";
import { SlotDTO } from "../../features/agenda/agenda.service";

@Pipe({ name: 'disponiveisCount', standalone: true })
export class DisponiveisCountPipe implements PipeTransform {
  transform(slots: SlotDTO[]): number {
    return slots.filter(s => s.disponivel).length;
  }
}