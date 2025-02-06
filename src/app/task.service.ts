import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

export interface Task {
  id: number,
  title: string,
  description: string,
  priority: string,
  status: string,
  userId: number,
}

@Injectable({
  providedIn: 'root'
})

export class TaskService {

  private taskUrl = `${environment.apiUrl}/task`;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) { }

  getUserTasks(): Observable<Task[]>{
    this.authService.isAuthenticated().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      })
    );

    return this.http.get<Task[]>(`${this.taskUrl}/my-tasks`, {
      withCredentials: true
    })
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.patch<Task>(`${this.taskUrl}/update/${task.id}`, task, {
      withCredentials: true
    });
  }
}
