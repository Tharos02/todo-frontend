import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {};


  isAuthenticated(): Observable<boolean> {
    return this.http.get(`${this.authUrl}/me`, { withCredentials: true }).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials, {
      withCredentials: true
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData, {
        withCredentials: true
      });
  }
}
