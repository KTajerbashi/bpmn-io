import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface IMenuDTO {
  entityId: string;
  name: string;
  title: string;
  icon: string;
  link: string;
  children?: IMenuDTO[];
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  menus = signal<IMenuDTO[]>([]);

  ngOnInit(): void {
    this.menus.set(this.loadMenus());
  }

  private loadMenus(): IMenuDTO[] {
    return [
      {
        entityId: 'dashboard',
        name: 'dashboard',
        title: 'Dashboard',
        icon: '⌂',
        link: '/dashboard',
        children: [],
      },
      {
        entityId: 'users',
        name: 'users',
        title: 'Users',
        icon: '♙',
        link: '/users',
        children: [],
      },
      {
        entityId: 'roles',
        name: 'roles',
        title: 'Roles',
        icon: '◈',
        link: '/roles',
        children: [],
      },
      {
        entityId: 'groups',
        name: 'groups',
        title: 'Groups',
        icon: '♧',
        link: '/groups',
        children: [],
      },
      {
        entityId: 'forms',
        name: 'forms',
        title: 'Forms',
        icon: '▤',
        link: '/forms',
        children: [],
      },
    ];
  }
}
