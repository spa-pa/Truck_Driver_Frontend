import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-notification',
    imports: [CommonModule, RouterModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  public notifications: boolean = false;

  notification() {
    this.notifications = !this.notifications
  }

  clickOutside():void { 
    this.notifications = false;
  }

}
