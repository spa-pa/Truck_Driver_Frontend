import { AfterViewInit, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormComponent } from "@shared/component/form/form.component";
import { TerminalService } from "@shared/_http/terminal.service";

@Component({
  selector: "app-cu-poster",
  imports: [CommonModule, FormsModule, FormComponent, ReactiveFormsModule],
  templateUrl: "./cu-poster.component.html",
  styleUrl: "./cu-poster.component.scss",
})
export class CuPosterComponent implements OnInit, AfterViewInit {
  subs: any;
  routeName: any;
  routeId: any;
  PosterTypeSearchGroupStructure!: IFormStructure[];
  PosterDetailsData: RowData = PosterDetailsData;

  uploadedFile: File | null = null;
  base64FileData: string | null = null;
  base64FileName: string | null = null;

  constructor(
    private router: Router,
    private activatedroute: ActivatedRoute,
    private posterService: PosterService,
    private terminalService: TerminalService,
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
      if (this.routeName == "view") ele.disable = true;
      if (ele.type == "select") this.setOptionValues(ele);
    });
  }

  setOptionValues(ele: any) {
    switch (ele.listName) {
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

  getPosterById() {
    this.subs.add(
      this.posterService.getPosterById(this.routeId).subscribe({
        next: (value) => {
          this.PosterDetailsData.data = value.data;
        },
      }),
    );
  }

  // New method to handle the raw file
  handleFileObject(file: File): void {
    // You may also check the field name if multiple uploads exist
    this.uploadedFile = file;
  }

  // Keep existing Base64 handler for preview or other purposes
  handleFileUpload(event: any): void {
    if (event?.fieldName === "poster_image") {
      this.PosterDetailsData.data.poster_image_file = event.base64String;
      this.PosterDetailsData.data.poster_image = event.imgName;
      // Store for later use in FormData
      this.base64FileData = event.base64String;
      this.base64FileName = event.imgName;
    }
  }

  handleSubmit(event: any) {
    // Validate that we have the file
    if (!this.base64FileData || !this.base64FileName) {
      this.toastService.open("Poster image is required", "error");
      return;
    }

    const formData = new FormData();
    const rawValue = event.formValue;

    // Append all fields except the poster_image control
    Object.keys(rawValue).forEach((key) => {
      if (key === "poster_image") return;
      if (rawValue[key] !== null && rawValue[key] !== undefined) {
        formData.append(key, String(rawValue[key]));
      }
    });

    // Convert Base64 to File and append
    const file = this.dataURLtoFile(this.base64FileData, this.base64FileName);
    formData.append("poster_image", file, this.base64FileName);
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

  private dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
}
