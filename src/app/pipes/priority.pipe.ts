import { Pipe, PipeTransform } from '@angular/core';
import {Status} from '../enums/status.enum';
import {Priority} from '../enums/priority.enum';

@Pipe({
  standalone: true,
  name: 'priorityLabel'
})
export class PriorityPipe implements PipeTransform {
  private priorityMap: Record<number, string> = {
    [Priority.LOW]: 'LOW',
    [Priority.MEDIUM]: 'MEDIUM',
    [Priority.HIGH]: 'HIGH'
  };

  transform(value: number): string {
    return this.priorityMap[value] ?? 'UNKNOWN';
  }
}
