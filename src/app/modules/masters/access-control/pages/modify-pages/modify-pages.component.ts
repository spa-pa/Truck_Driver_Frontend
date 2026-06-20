import { AfterViewInit, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '@shared/_http/pages.service';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { PageDetails, PageFormGroup } from '@shared/configs/page-config';
import { responseMessages } from '@shared/constants/response-msgs.constant';
import { IFormStructure } from '@shared/models/form';
import { RowData } from '@shared/models/table';
import { LoaderService } from '@shared/services/loader.service';
import { ToastService } from '@shared/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modify-pages',
  standalone: false,
  templateUrl: './modify-pages.component.html',
  styleUrl: './modify-pages.component.scss'
})
export class ModifyPagesComponent implements OnInit, AfterViewInit {

  subs: Subscription;
  routeName: string;
  pageFormStructure!: IFormStructure[];
  PageDetailsData: RowData = PageDetails;
  routeId: string | null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private pageControllerService: PageService, private toastService: ToastService, private loader: LoaderService) { }

  ngOnInit(): void {
    this.subs = new Subscription();
    this.pageFormStructure = JSON.parse(JSON.stringify(PageFormGroup));
    this.activatedRoute.url.subscribe(urlSegments => {
      this.routeName = urlSegments[0]?.path;
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.routeId = params.get('id');
    });
    this.initialization();
  }

  ngAfterViewInit(): void {
    if (this.routeId)
      this.getPage();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  initialization(): void {
    this.pageFormStructure.forEach((ele, index) => {
      if (this.routeName === 'view')
        ele.disable = true;
    });
  }

  getPage() {
    this.loader.showLoader();
    this.subs.add(this.pageControllerService.getPage(this.routeId).subscribe({
      next: (value) => {
        this.loader.hideLoader();
        this.PageDetailsData.data = value.data;
      }, error: () => {
        this.loader.hideLoader();
      }
    }));
  }

  handleSubmit(event: any) {
    let formData = JSON.parse(JSON.stringify(event["formValue"]));
    this.loader.showLoader();
    switch (this.routeName) {
      case 'create':
        this.subs.add(this.pageControllerService.createPage(formData).subscribe({
          next: (value) => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl("/pages");
          },
          error: (err) => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === err.error_message)?.message ?? 'Something went wrong!';
            this.toastService.open(message, 'error');
          }
        }));
        break;
      case 'edit':
        this.subs.add(this.pageControllerService.updatePage(formData, this.routeId).subscribe({
          next: (value) => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === value.error_message)?.message ?? '';
            this.toastService.open(message, 'success');
            this.router.navigateByUrl("/pages");
          },
          error: (err) => {
            this.loader.hideLoader();
            const message = responseMessages.codes.find(item => item.code === err.error_message)?.message ?? 'Something went wrong!';
            this.toastService.open(message, 'error');
          }
        }));
        break;
    }
  }
}
