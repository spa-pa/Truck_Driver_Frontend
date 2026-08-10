import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TerminalService } from '@shared/_http/terminal.service';
import { TerminalDetailsData } from '@shared/configs/terminal-config';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss',
  standalone: false
})
export class TerminalComponent {
  TerminalDetailsData: RowData = TerminalDetailsData;
  subs: any;

  constructor(private router: Router, private terminalService: TerminalService, private toastService: ToastService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllTerminals();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllTerminals() {
    this.subs.add(this.terminalService.getAllTerminals().subscribe({
      next: (value) => {
        this.TerminalDetailsData.data = value.data;
      }
    }))
  }

  handleCreateAction() {
    this.router.navigateByUrl("/terminal/create")
  }

  handleDeleteAction(event: any) {
   this.subs.add(
    this.terminalService.deleteTerminal(event).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.open(response.message, 'success');
          this.getAllTerminals();
        } else {
          this.toastService.open(response.message || 'Deletion failed', 'error');
        }
      },
      error: (err) => {
        this.toastService.open('An error occurred while deleting the terminal.', 'error');
      }
    })
  );
}

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/terminal/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/terminal/view/${event}`)
  }
}
