import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limit',
  pure: false
})
export class LimitPipe implements PipeTransform {

  transform(value: any, lim: number): any {
    let limit = isNaN(lim) ? 1 : lim;
    return value.slice(0, limit);
  }

}
