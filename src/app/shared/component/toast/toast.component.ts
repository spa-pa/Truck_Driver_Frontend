import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule, MessagesModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {

  messages!: Message[];

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.getTypeClass(data);
  }

  dismiss(): void {
    this.data.dismiss();
  }

  private getTypeClass(data: any): void {
    switch (data.type) {
      case 'success':
        this.messages = [{ severity: 'success', summary: 'Success', detail: data.message }];
        break;
      case 'error':
        this.messages = [{ severity: 'error', summary: 'error', detail: data.message }];
        break;
      case 'info':
        this.messages = [{ severity: 'info', summary: 'info', detail: data.message }];
        break;
      case 'warn':
        this.messages = [{ severity: 'warn', summary: 'warn', detail: data.message }];
        break;
      default:
        this.messages = [{ severity: 'success', summary: 'Success', detail: data.message }];
        break;
    }
  }

}

