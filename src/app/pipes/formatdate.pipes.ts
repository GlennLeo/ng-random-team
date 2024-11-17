import { Pipe, PipeTransform } from '@angular/core';
import  moment from 'moment'

@Pipe({ name: 'formatDate', standalone : true })
export class FormatDatePipe implements PipeTransform {
  transform(input: any, format: string = 'DD/MM/YYYY'): any {
    if (!input) {
      return '';
    }
    return moment.utc(input).local().format(format);
  }
}
