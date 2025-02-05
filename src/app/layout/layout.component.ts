import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterOutlet} from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {FormsModule} from '@angular/forms';
import {Avatar} from 'primeng/avatar';
import {ContextMenu} from 'primeng/contextmenu';
import {Menu} from 'primeng/menu';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    Menubar,
    FormsModule,
    Avatar,
    ContextMenu,
    Menu
  ],
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  items: MenuItem[];
  userMenuItems: MenuItem[];

  constructor() {
    this.items = [
      {
        label: 'Board',
        icon: 'pi pi-fw pi-home',
        routerLink: '/board'
      }
    ];

    this.userMenuItems = [
      {label: 'Logout', icon: 'pi pi-sign-out'}
    ];
  }
}
