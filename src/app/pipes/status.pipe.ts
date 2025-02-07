import { Pipe, PipeTransform } from '@angular/core';
import {Status} from '../enums/status.enum';

@Pipe({
  standalone: true,
  name: 'statusLabel'
})
export class StatusPipe implements PipeTransform {

  private statusMap: Record<number, string> = {
    [Status.TODO]: 'Todo',
    [Status.IN_PROGRESS]: 'In Progress',
    [Status.DONE]: 'Done'
  };

  transform(value: number): string {
    return this.statusMap[value] ?? 'UNKNOWN';
  }

}
