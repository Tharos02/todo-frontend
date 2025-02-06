import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {AuthService} from '../auth.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    InputText,
    Button,
    RouterLink,
    NgClass
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  credentials = {
    username: '',
    email: '',
    password: ''
  };
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  @ViewChild('passwordInput') passwordInput: ElementRef<HTMLInputElement> | undefined

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.credentials.email && this.credentials.password) {

      this.authService.register(this.credentials).subscribe({
        next: (response) => {
          console.log('Registrierung erfolgreich:', response);

          this.messageService.add({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: 'Registrierung erfolgreich! Logge dich nun ein!',
          });
          //TODO: Zu board seite führen
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registrierung fehlgeschlagen:', error);

          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Registrierung fehlgeschlagen! Überprüfe deine Eingaben.',
          });
        },
      });
    }
  }
}
