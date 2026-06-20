import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TerminalService } from '@shared/_http/terminal.service';
import { FormComponent } from '@shared/component/form/form.component';
import { TerminalDetailsData, TerminalTypeSearchGroup } from '@shared/configs/terminal-config';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cu-terminal',
  imports: [FormComponent],
  templateUrl: './cu-terminal.component.html',
  styleUrl: './cu-terminal.component.scss'
})
export class CuTerminalComponent implements OnInit, AfterViewInit{
  
    subs: any;
    routeName: any;
    routeId: any;
    TerminalTypeSearchGroupStructure!: IFormStructure[];
    TerminalDetailsData: RowData = TerminalDetailsData;
  
    constructor(
      private router: Router,
      private activatedroute: ActivatedRoute,
      private terminalService: TerminalService,
      private toastService: ToastService,
    ) {}
  
    ngOnInit(): void {
      this.subs = new Subscription();
      this.TerminalTypeSearchGroupStructure = JSON.parse(
        JSON.stringify(TerminalTypeSearchGroup),
      );
      this.activatedroute.url.subscribe((urlSegments) => {
        this.routeName = urlSegments[0]?.path;
      });
      this.activatedroute.paramMap.subscribe((params) => {
        this.routeId = params.get("id");
      });
      this.initialization();
    }
  
    ngAfterViewInit(): void {
      if (this.routeId) this.getTerminalById();
    }
  
    ngOnDestroy(): void {
      this.subs.unsubscribe();
    }
  
    initialization(): void {
      this.TerminalTypeSearchGroupStructure.forEach((ele, index) => {});
    }
  
    getTerminalById() {
      this.subs.add(
        this.terminalService.getTerminalById(this.routeId).subscribe({
          next: (value) => {
            this.TerminalDetailsData.data = value.data;
          },
        }),
      );
    }
  
    handleSubmit(event: any) {
      debugger;
      let formData = JSON.parse(JSON.stringify(event["formValue"]));
      switch (this.routeName) {
        case "create":
          this.subs.add(
            this.terminalService.createTerminal(formData).subscribe({
              next: (value) => {
                this.toastService.open(value.message, "success");
                this.router.navigateByUrl("/terminal");
              },
              error: (err) => {
                this.toastService.open(err.error.message, "error");
              },
            }),
          );
          break;
        case "edit":
          this.subs.add(
            this.terminalService
              .updateTerminal(formData, this.routeId)
              .subscribe({
                next: (value) => {
                  this.toastService.open(value.message, "success");
                  this.router.navigateByUrl("/terminal");
                },
                error: (err) => {
                  this.toastService.open(err.error.message, "error");
                },
              }),
          );
          break;
      }
    }
}
