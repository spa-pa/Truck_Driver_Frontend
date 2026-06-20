import { AfterViewInit, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LanguageService } from "@shared/_http/language.service";
import { FormComponent } from "@shared/component/form/form.component";
import {
  LanguageDetailsData,
  LanguageTypeSearchGroup,
} from "@shared/configs/language-config";
import { responseMessages } from "@shared/constants/response-msgs.constant";
import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";
import { ToastService } from "@shared/services/toast.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cu-language",
  imports: [FormComponent],
  templateUrl: "./cu-language.component.html",
  styleUrl: "./cu-language.component.scss",
})
export class CuLanguageComponent implements OnInit, AfterViewInit {
  subs: any;
  routeName: any;
  routeId: any;
  LanguageTypeSearchGroupStructure!: IFormStructure[];
  LanguageDetailsData: RowData = LanguageDetailsData;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private languageService: LanguageService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.subs = new Subscription();
    this.LanguageTypeSearchGroupStructure = JSON.parse(
      JSON.stringify(LanguageTypeSearchGroup),
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
    if (this.routeId) this.getByLanguageId();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initialization(): void {
    this.LanguageTypeSearchGroupStructure.forEach((ele, index) => {});
  }

  getByLanguageId() {
    this.subs.add(
      this.languageService.getByLanguageId(this.routeId).subscribe({
        next: (value) => {
          this.LanguageDetailsData.data = value.data;
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
          this.languageService.createLanguage(formData).subscribe({
            next: (value) => {
              this.toastService.open(value.message, "success");
              this.router.navigateByUrl("/language");
            },
            error: (err) => {
              this.toastService.open(err.error.message, "error");
            },
          }),
        );
        break;
      case "edit":
        this.subs.add(
          this.languageService
            .updateLanguage(formData, this.routeId)
            .subscribe({
              next: (value) => {
                this.toastService.open(value.message, "success");
                this.router.navigateByUrl("/language");
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
