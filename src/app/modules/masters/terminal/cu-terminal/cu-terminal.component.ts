import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CityService } from '@shared/_http/city.service';
import { CountryService } from '@shared/_http/country.service';
import { StateService } from '@shared/_http/state.service';
import { TerminalService } from '@shared/_http/terminal.service';
import { TerminalDetailsData, TerminalTypeSearchGroup } from '@shared/configs/terminal-config';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cu-terminal',
  templateUrl: './cu-terminal.component.html',
  styleUrl: './cu-terminal.component.scss',
  standalone: false
})
export class CuTerminalComponent implements OnInit, AfterViewInit {

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
    private countryservice: CountryService,
    private stateservice: StateService,
    private cityservice: CityService
  ) { }

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
    this.TerminalTypeSearchGroupStructure.forEach((ele, index) => {
      if (this.routeName == 'view')
        ele.disable = true
      if (ele.type == 'select')
        this.setOptionValues(ele)
    })
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
      case "country":
        this.subs.add(this.countryservice.getAllCountry().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break
      case "city":
        this.subs.add(this.cityservice.getAllCity().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break
      case "state":
        this.subs.add(this.stateservice.getAllState().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break
    }
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
