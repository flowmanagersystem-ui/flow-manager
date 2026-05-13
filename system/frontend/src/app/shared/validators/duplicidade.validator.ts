import { HttpClient } from "@angular/common/http";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { catchError, map, of, switchMap, timer } from "rxjs";

export function validarDuplicidade(
  http: HttpClient,
  api: string,
  campo: string,
  getId: () => any
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    const valor = control.value;
    const excludeId = getId();

    if (!valor) return of(null);

    const params = excludeId
      ? `?campo=${campo}&valor=${valor}&excludeId=${excludeId}`
      : `?campo=${campo}&valor=${valor}`;

    return timer(500).pipe(
      switchMap(() => http.get<{ existe: boolean }>(`${api}/verificar-duplicidade${params}`)),
      map(res => res.existe ? { duplicado: true } : null),
      catchError(() => of(null))
    );
  };
}