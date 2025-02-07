import {Component, Input, OnInit} from '@angular/core';
import {DialogService} from '../dialog.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {Textarea} from 'primeng/textarea';
import {Task} from '../task.service';
import {NgIf} from '@angular/common';
import {Priority} from '../enums/priority.enum';
import {PriorityPipe} from '../pipes/priority.pipe';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  imports: [
    Button,
    Dialog,
    InputText,
    ReactiveFormsModule,
    Select,
    Textarea,
    FormsModule,
    NgIf,
    PriorityPipe
  ],
  standalone: true
})
export class TaskComponent implements OnInit {
  @Input() task: any;
  visibleTaskDialog: boolean = false;
  editMode: boolean = false;
  priorityOptions: Object[] = [
    {name: 'Low', value: Priority.LOW},
    {name: 'Medium', value: Priority.MEDIUM},
    {name: 'High', value: Priority.HIGH}
  ];
  oldTask: any;
  editTask: any;

  constructor() {
  }

  ngOnInit() {
    this.editTask = {...this.task};
  }


  protected readonly console = console;
  protected readonly Priority = Priority;
}
