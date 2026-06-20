import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '@shared/_http/state.service';
import { StateDetailsData } from '@shared/configs/state-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrl: './state.component.scss',
  standalone: false
})
export class StateComponent implements OnInit {

  StateDetailsData: RowData = StateDetailsData;
  subs: any;

  constructor(private router: Router, private stateService: StateService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllState();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllState() {
    this.subs.add(this.stateService.getAllState().subscribe({
      next: (value) => {
        this.StateDetailsData.data = value.data;
      }
    }))
  }


  handleCreateAction() {
    this.router.navigateByUrl("/state/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.stateService.deleteState(event).subscribe({
      next: (value) => {
        this.getAllState()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/state/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/state/view/${event}`)
  }

}


