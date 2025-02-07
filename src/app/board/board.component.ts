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
import {MessageService} from 'primeng/api';
import {StatusPipe} from '../pipes/status.pipe';

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
    StatusPipe,
  ],
  styleUrls: ['./board.component.css']
})

export class BoardComponent implements OnInit {

  constructor(private taskService: TaskService, private dialogService: DialogService, private messageService: MessageService, private statusPipe: StatusPipe) {
  }

  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  visible: boolean = false;
  priorityOptions: Object[] = [
    {name: 'Low', value: Priority.LOW},
    {name: 'Medium', value: Priority.MEDIUM},
    {name: 'High', value: Priority.HIGH}
  ];
  statusOptions: Object[] = [];

  newTask = {
    title: '',
    description: '',
    priority: Priority.LOW,
    status: Status.TODO
  };

  visibleTaskDialog: boolean = false;

  editTask = {
    title: '',
    priority: Priority,
    description: '',
    status: Status.TODO
  };

  oldTask = {
    title: '',
    priority: Priority,
    description: '',
    status: Status.TODO
  };
  editMode: Boolean = false;


  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      let task: any = {
        id: event.item.data.id,
        title: event.item.data.title,
        priority: event.item.data.priority,
        description: event.item.data.description,
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
      this.loadTasks();
    }
  }

  ngOnInit(): void {

    this.statusOptions = [
      {name: this.statusPipe.transform(Status.TODO), value: Status.TODO},
      {name: this.statusPipe.transform(Status.IN_PROGRESS), value: Status.IN_PROGRESS},
      {name: this.statusPipe.transform(Status.DONE), value: Status.DONE}
    ]

    this.dialogService.dialogTrigger$.subscribe(() => {
      this.visible = true;
    });

    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getUserTasks().subscribe({
      next: (response) => {

        this.todo = response.filter(task => task.status === Status.TODO || task.status === null);
        this.inProgress = response.filter(task => task.status === Status.IN_PROGRESS);
        this.done = response.filter(task => task.status === Status.DONE);

        this.sortTasks();

      },
      error: (error) => {
        console.error(error);
      }
    });
  }


  updateTask(task: any) {
    this.taskService.updateTask(task).subscribe({
      next: (response) => {
      }, error: (error) => {
        console.error(error);
      }
    })
  }

  saveTask(): void {
    this.taskService.createTask(this.newTask).subscribe({
      next: () => {
        this.loadTasks();
        this.visible = false;
      }, error: (error) => {
        console.error(error);
      }
    })
  }

  sortTasks() {
    this.todo.sort((a, b) => b.priority - a.priority);
    this.inProgress.sort((a, b) => b.priority - a.priority);
    this.done.sort((a, b) => b.priority - a.priority);
  }

  openTask(task: any) {
    this.visibleTaskDialog = true;
    this.editTask = {...task};
    this.oldTask = {...task};
  }

  abortEdit() {
    this.editMode = false;
    this.editTask = {...this.oldTask};
  }

  saveEditTask() {
    this.taskService.updateTask(this.editTask).subscribe({
      next: (response) => {
        if (this.visibleTaskDialog) {
          this.visibleTaskDialog = false;
          this.editMode = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: 'Änderungen wurden erfolgreich übernommen!',
          });
          this.loadTasks();
        }
      }, error: (error) => {
        console.error(error);
      }
    })
  }

  protected readonly Status = Status;
}
