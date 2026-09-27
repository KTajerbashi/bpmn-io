import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianDate',
})
export class PersianDatePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
