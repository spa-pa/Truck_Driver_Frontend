import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeathericonComponent } from '../../feathericon/feathericon.component';

@Component({
    selector: 'app-messages',
    imports: [CommonModule, RouterModule, FeathericonComponent],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.scss'
})
export class MessagesComponent {

  public messages: boolean = false;

  message() {
    this.messages = !this.messages
  }

  clickOutside(): void {
    this.messages = false;
  }


}
