import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TerminalService } from '@shared/_http/terminal.service';
import { TableComponent } from '@shared/component/table/table.component';
import { TerminalDetailsData } from '@shared/configs/terminal-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terminal',
  imports: [TableComponent],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss'
})
export class TerminalComponent {
  TerminalDetailsData: RowData = TerminalDetailsData;
  subs: any;

  constructor(private router: Router, private terminalService: TerminalService) { }


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
    this.subs.add(this.terminalService.deleteTerminal(event).subscribe({
      next: (value) => {
        this.getAllTerminals()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/terminal/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/terminal/view/${event}`)
  }
}
