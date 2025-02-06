import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogTriggerSource = new Subject<void>();
  dialogTrigger$ = this.dialogTriggerSource.asObservable();

  constructor() { }

  triggerDialog() {
    this.dialogTriggerSource.next();
  }
}
