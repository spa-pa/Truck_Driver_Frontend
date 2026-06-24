import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService, ModalOptions } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit, OnDestroy{
 isVisible = false;
  modalOptions: ModalOptions | null = null;
  private subscription: Subscription | null = null;

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.subscription = this.modalService.modalState$.subscribe((options) => {
      this.modalOptions = options;
      this.isVisible = true;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getIconClass(): string {
    if (!this.modalOptions) return 'fa-info-circle';
    switch (this.modalOptions.type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-times-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      case 'confirm': return 'fa-question-circle';
      default: return 'fa-info-circle';
    }
  }

  close() {
    this.isVisible = false;
    this.modalOptions = null;
  }

  confirm() {
    if (this.modalOptions?.onConfirm) {
      this.modalOptions.onConfirm();
    }
    this.close();
  }

  cancel() {
    if (this.modalOptions?.onCancel) {
      this.modalOptions.onCancel();
    }
    this.close();
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
