import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PageService } from '@shared/_http/pages.service';
import { PermissionControllerService } from '@shared/_http/permissions.service';
import { PageDetails } from '@shared/configs/page-config';
import { RowData } from '@shared/models/table';
import { LoaderService } from '@shared/services/loader.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pages',
  standalone: false,
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit, OnDestroy {
  pageDetailsData: RowData = PageDetails;
  subs: Subscription;

  constructor(private router: Router, private pageControllerService: PageService, private loader: LoaderService) {
    this.subs = new Subscription();
  }

  ngOnInit(): void {
    this.getAllPages();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getAllPages() {
    this.loader.showLoader();
    this.subs.add(this.pageControllerService.getAllPage().subscribe({
      next: (value) => {
        this.loader.hideLoader();
        console.log('value = ', value.data);
        this.pageDetailsData.data = value.data;
      }, error: () => {
        this.loader.hideLoader();
      }
    }));
  }

  handleCreateAction() {
    this.router.navigateByUrl("/pages/create");
  }

  handleDeleteAction(event: any) {
    // Implement delete action
    this.loader.showLoader();
    this.subs.add(this.pageControllerService.deletePageById(event).subscribe({
      next: (value) => {
        this.loader.hideLoader();
        this.getAllPages();
      }, error: () => {
        this.loader.hideLoader();
      }
    }));
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/pages/edit/${event}`);
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/pages/view/${event}`);
  }
}
