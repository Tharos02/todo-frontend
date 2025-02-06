import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {Router, RouterOutlet} from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {FormsModule} from '@angular/forms';
import {Avatar} from 'primeng/avatar';
import {Menu} from 'primeng/menu';
import {AuthService} from '../auth.service';
import {DialogService} from '../dialog.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    Menubar,
    FormsModule,
    Avatar,
    Menu
  ],
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  items: MenuItem[];
  userMenuItems: MenuItem[];

  constructor(private authService: AuthService, private router: Router, private dialogService: DialogService) {
    this.items = [
      {
        label: 'Board',
        icon: 'pi pi-fw pi-home',
        routerLink: '/board'
      },
      {
        label: 'Neue Task',
        icon: 'pi pi-plus-circle',
        command: () => {
          this.dialogService.triggerDialog();
        }
      }
    ];

    this.userMenuItems = [
      {label: 'Logout', icon: 'pi pi-sign-out', command: () => this.handleLogout(),}
    ];
  }

  handleLogout() {
    this.authService.logout().subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout fehlgeschlagen:', error);
      },
    });

  }
}
