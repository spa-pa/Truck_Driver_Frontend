import { AfterViewInit, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiLanguageService } from "@shared/_http/language.service";
import { PosterService } from "@shared/_http/poster.service";
import {
  PosterDetailsData,
  PosterTypeSearchGroup,
} from "@shared/configs/poster-config";
import { IFormStructure } from "@shared/models/form";
import { RowData } from "@shared/models/table";
import { ToastService } from "@shared/services/toast.service";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FormComponent } from "@shared/component/form/form.component";

@Component({
  selector: 'app-cu-poster',
  imports: [CommonModule, FormsModule, FormComponent],
  templateUrl: './cu-poster.component.html',
  styleUrl: './cu-poster.component.scss',
})
export class CuPosterComponent implements OnInit, AfterViewInit{
  subs: any;
  routeName: any;
  routeId: any;
  PosterTypeSearchGroupStructure!: IFormStructure[];
  PosterDetailsData: RowData = PosterDetailsData;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private posterService: PosterService,
    private apiLanguageService: ApiLanguageService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.subs = new Subscription();
    this.PosterTypeSearchGroupStructure = JSON.parse(
      JSON.stringify(PosterTypeSearchGroup),
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
    if (this.routeId) this.getPosterById();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initialization(): void {
    this.PosterTypeSearchGroupStructure.forEach((ele, index) => {
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
        break
    }
  }

  getPosterById() {
    this.subs.add(
      this.posterService.getPosterById(this.routeId).subscribe({
        next: (value) => {
          this.PosterDetailsData.data = value.data;
        },
      }),
    );
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]));
    switch (this.routeName) {
      case "create":
        this.subs.add(
          this.posterService.createPoster(formData).subscribe({
            next: (value) => {
              this.toastService.open(value.message, "success");
              this.router.navigateByUrl("/poster");
            },
            error: (err) => {
              this.toastService.open(err.error.message, "error");
            },
          }),
        );
        break;
      case "edit":
        this.subs.add(
          this.posterService.updatePoster(formData, this.routeId).subscribe({
            next: (value) => {
              this.toastService.open(value.message, "success");
              this.router.navigateByUrl("/poster");
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
