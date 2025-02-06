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
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];
  visible: boolean = false;
  priorityOptions: Object[] = [
    {name: 'Low', value: Priority.LOW},
    {name: 'Medium', value: Priority.MEDIUM},
    {name: 'High', value: Priority.HIGH}
  ];
  newTask = {
    title: '',
    description: '',
    priority: Priority.LOW,
    status: 'TODO'
  };


  constructor(private taskService: TaskService, private dialogService: DialogService) {
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      this.sortTasks();

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


  updateTask(task: Task) {
    this.taskService.updateTask(task).subscribe({
      next: (response) => {
        console.log(response);
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
    const priorityOrder: Record<string, number> = {
      "HIGH": 1,
      "MEDIUM": 2,
      "LOW": 3
    };

    this.todo.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    this.inProgress.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    this.done.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }


  protected readonly Priority = Priority;
}
