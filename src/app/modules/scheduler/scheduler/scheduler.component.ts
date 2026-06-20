import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulerService } from '@shared/_http/scheduler.service';
import { schedulerDetailsData } from '@shared/configs/scheduler-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-scheduler',
  standalone: false,
  templateUrl: './scheduler.component.html',
  styleUrl: './scheduler.component.scss'
})
export class SchedulerComponent {

  schedulerDetailsData: RowData = schedulerDetailsData;
  subs: any;

  constructor(private router: Router, private schedulerservice: SchedulerService) { }

  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllScheduler();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllScheduler() {
    this.subs.add(this.schedulerservice.getAllScheduler().subscribe({
      next: (value) => {
        this.schedulerDetailsData.data = value.data;
        console.log(JSON.stringify(this.schedulerDetailsData.data));
      }
    }))
  }

  handleCreateAction() {
    this.router.navigateByUrl("/scheduler/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.schedulerservice.deleteScheduler(event).subscribe({
      next: (value) => {
        this.getAllScheduler()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/scheduler/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/scheduler/view/${event}`)
  }

}

