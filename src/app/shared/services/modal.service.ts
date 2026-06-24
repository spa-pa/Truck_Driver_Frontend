import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

export interface ModalOptions {
  type: "success" | "error" | "warning" | "info" | "confirm";
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: "root",
})
export class ModalService {
  private modalSubject = new Subject<ModalOptions>();
  modalState$ = this.modalSubject.asObservable();

  show(options: ModalOptions) {
    this.modalSubject.next(options);
  }

  success(title: string, message: string) {
    this.show({ type: "success", title, message });
  }

  error(title: string, message: string) {
    this.show({ type: "error", title, message });
  }

  warning(title: string, message: string) {
    this.show({ type: "warning", title, message });
  }

  info(title: string, message: string) {
    this.show({ type: "info", title, message });
  }

  confirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmText: string = "Yes",
    cancelText: string = "Cancel",
  ) {
    this.show({
      type: "confirm",
      title,
      message,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
    });
  }
}
