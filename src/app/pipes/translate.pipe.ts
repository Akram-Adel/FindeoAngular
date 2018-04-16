import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  transform(value: any): any {
    if (value == 'For Sale') {
      return 'للبيع';

    } else if (value == 'For Rent') {
      return 'للإيجار';

    } else if (value == 'First Floor') {
      return 'الدور الاول';

    } else if (value == 'Second Floor') {
      return 'الدور الثاني';

    } else if (value == 'Garage') {
      return 'الجراج';

    }

    return value;
  }

}
