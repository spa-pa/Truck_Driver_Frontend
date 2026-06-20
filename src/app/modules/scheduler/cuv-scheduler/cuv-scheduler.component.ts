import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';
import { schedulerDetailsData, schedulerSearchGroup } from '@shared/configs/scheduler-config';
import { SchedulerService } from '@shared/_http/scheduler.service';
import { DurationService } from '@shared/_http/duration.service';

@Component({
  selector: 'app-cuv-scheduler',
  standalone: false,
  templateUrl: './cuv-scheduler.component.html',
  styleUrl: './cuv-scheduler.component.scss'
})
export class CuvSchedulerComponent implements OnInit, AfterViewInit {

  subs: any;
  routeName: any;
  routeId: any;
  schedulerGroupStructure!: IFormStructure[];
  schedulerDetailsData: RowData = schedulerDetailsData;

  constructor(private router: Router, private activatedroute: ActivatedRoute, private schedulerservice: SchedulerService, private toastService: ToastService, private durationservice: DurationService) { }


  ngOnInit(): void {

    this.subs = new Subscription()

    this.schedulerGroupStructure = JSON.parse(JSON.stringify(schedulerSearchGroup));
    this.activatedroute.url.subscribe(urlSegments => {
      this.routeName = urlSegments[0]?.path;
    });
    this.activatedroute.paramMap.subscribe(params => {
      this.routeId = params.get('id');
    });

    this.initialization()
  }

  ngAfterViewInit(): void {
    if (this.routeId)
      this.getScheduler()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  initialization(): void {
    this.schedulerGroupStructure.forEach((ele, index) => {
      if (ele.type == 'select')
        this.setOptionValues(ele)
      if (this.routeName == 'view')
        ele.disable = true
    })
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
      case "duration":
        this.subs.add(this.durationservice.getAllDuration().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break
    }
  }


  getScheduler() {
    this.subs.add(this.schedulerservice.getScheduler(this.routeId).subscribe({
      next: (value) => {
        this.schedulerDetailsData.data = value.data
      }
    }))
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]))
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.schedulerservice.createScheduler(formData).subscribe({
          next: (value) => {
            const message = responseMessages.codes.find(item => item.code == value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl("/scheduler")
          },
          error: (err) => {
            const message = responseMessages.codes.find(item => item.code == err.error_message)?.message ?? 'Something went to wrong!';
            this.toastService.open(message, 'error');
          }
        }))
        break;
      case 'edit':
        this.subs.add(this.schedulerservice.updateScheduler(formData, this.routeId).subscribe({
          next: (value) => {
            const message = responseMessages.codes.find(item => item.code == value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl("/scheduler")
          },
          error: (err) => {
            const message = responseMessages.codes.find(item => item.code == err.error_message)?.message ?? 'Something went to wrong!';
            this.toastService.open(message, 'error');
          }
        }))
        break;

    }
  }

}


