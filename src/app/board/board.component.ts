import {Component, OnInit} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {NgForOf} from '@angular/common';
import {TaskComponent} from '../task/task.component';
import {Task, TaskService} from '../task.service';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {Textarea} from 'primeng/textarea';
import {DialogService} from '../dialog.service';
import {Priority} from '../enums/priority.enum';
import {Status} from '../enums/status.enum';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  standalone: true,
  imports: [
    CdkDropList,
    NgForOf,
    CdkDrag,
    TaskComponent,
    CdkDropListGroup,
    Button,
    Dialog,
    InputText,
    Select,
    FormsModule,
    Textarea,
  ],
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit {
  todo: object[] = [];
  inProgress: object[] = [];
  done: object[] = [];
  visible: boolean = false;
  priorityOptions: Object[] = [
    {name: 'Low', value: Priority.LOW},
    {name: 'Medium', value: Priority.MEDIUM},
    {name: 'High', value: Priority.HIGH}
  ];
  newTask = {
    title: '',
    description: '',
    selectedPriority: Priority.LOW,
    status: 'TODO'
  };


  constructor(private taskService: TaskService, private dialogService: DialogService) {
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      console.log(event);
      let task: any = {
        id: event.item.data.id,
        title: event.item.data.title,
        priority: event.item.data.priority,
        status: null
      }

      switch (event.container.id) {
        case 'todo':
          task.status = Status.TODO;
          break;
        case 'in_progress':
          task.status = Status.IN_PROGRESS;
          break;
        case 'done':
          task.status = Status.DONE;
      }

      this.updateTask(task);
    }
  }

  ngOnInit(): void {

    this.dialogService.dialogTrigger$.subscribe(() => {
      this.visible = true;
    });

    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getUserTasks().subscribe({
      next: (response) => {
        this.todo = response.filter(todo => todo.status === Status.TODO || todo.status === null);
        this.inProgress = response.filter(todo => todo.status === Status.IN_PROGRESS);
        this.done = response.filter(todo => todo.status === Status.DONE);
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  updateTask(task: Task) {
    console.log(task);
    this.taskService.updateTask(task).subscribe({
      next: (response) => {
        console.log(response);
      }, error: (error) => {
        console.error(error);
      }
    })
  }

  saveTask(): void {
    console.log(this.newTask);
  }

  protected readonly Priority = Priority;
}
