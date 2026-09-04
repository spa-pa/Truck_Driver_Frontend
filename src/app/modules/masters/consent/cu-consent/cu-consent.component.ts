import { AfterViewInit, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiLanguageService } from "@shared/_http/language.service";
import { ConsentService } from "@shared/_http/consent.service";
import {
  ConsentDetailsData,
  ConsentTypeSearchGroup,
} from "@shared/configs/consent-config";
import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";
import { ToastService } from "@shared/services/toast.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FormComponent } from "@shared/component/form/form.component";
import { TerminalService } from "@shared/_http/terminal.service";

@Component({
  selector: "app-cu-consent",
  imports: [CommonModule, FormsModule, FormComponent],
  templateUrl: "./cu-consent.component.html",
  styleUrl: "./cu-consent.component.scss",
})
export class CuConsentComponent implements OnInit, AfterViewInit {
  subs: any;
  routeName: any;
  routeId: any;
  ConsentTypeSearchGroupStructure!: IFormStructure[];
  ConsentDetailsData: RowData = ConsentDetailsData;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private consentService: ConsentService,
    private apiLanguageService: ApiLanguageService,
    private toastService: ToastService,
    private terminalService: TerminalService,
  ) {}

  ngOnInit(): void {
    this.subs = new Subscription();
    this.ConsentTypeSearchGroupStructure = JSON.parse(
      JSON.stringify(ConsentTypeSearchGroup),
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
    if (this.routeId) this.getConsentById();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initialization(): void {
    this.ConsentTypeSearchGroupStructure.forEach((ele, index) => {
       if (this.routeName == 'view')
        ele.disable = true
      if (ele.type == 'select')
        this.setOptionValues(ele)
    });
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
      case "language":
        this.subs.add(this.apiLanguageService.getAllLanguages().subscribe({
          next: (value) => {
            ele.listData = value.data
          }
        }))
        break;
        case "terminal":
        this.subs.add(
          this.terminalService.getAllTerminals().subscribe({
            next: (value) => {
              ele.listData = value.data;
            },
          }),
        );
        break;
    }
  }

  // getConsentById() {
  //   this.subs.add(
  //     this.consentService.getConsentById(this.routeId).subscribe({
  //       next: (value) => {
  //         this.ConsentDetailsData.data = value.data;
  //       },
  //     }),
  //   );
  // }

  getConsentById() {
  this.subs.add(
    this.consentService.getConsentById(this.routeId).subscribe({
      next: (value) => {
        const data = value.data;
        // Convert description object to pretty JSON string
        if (data.description && typeof data.description === 'object') {
          data.description = JSON.stringify(data.description, null, 2);
        }
        this.ConsentDetailsData.data = data; // patch this to form
      },
    })
  );
}

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]));
    switch (this.routeName) {
      case "create":
        this.subs.add(
          this.consentService.createConsent(formData).subscribe({
            next: (value) => {
              this.toastService.open(value.message, "success");
              this.router.navigateByUrl("/consent");
            },
            error: (err) => {
              this.toastService.open(err.error.message, "error");
            },
          }),
        );
        break;
      case "edit":
        this.subs.add(
          this.consentService.updateConsent(formData, this.routeId).subscribe({
            next: (value) => {
              this.toastService.open(value.message, "success");
              this.router.navigateByUrl("/consent");
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
