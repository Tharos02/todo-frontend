import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {InputText} from 'primeng/inputtext';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth.service';
import {MessageService} from 'primeng/api';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    Button,
    InputText,
    RouterLink,
    MessageModule,
    MessagesModule,
    NgClass
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };
  private submitted: boolean | undefined;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
  }


  onSubmit() {
    this.submitted = true;

    if (this.credentials.email && this.credentials.password) {

      this.authService.login(this.credentials).subscribe({
        next: (response) => {
          console.log('Login erfolgreich:', response);

          this.messageService.add({
            severity: 'success',
            summary: 'Erfolgreich',
            detail: 'Anmeldung erfolgreich!',
          });
          //TODO: Zu board seite führen
          this.router.navigate(['/board']);
        },
        error: (error) => {
          console.error('Login fehlgeschlagen:', error);

          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Anmeldung fehlgeschlagen! Überprüfe deine Eingaben.',
          });
        },
      });
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
}
