import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FeathericonComponent } from '../feathericon/feathericon.component';
import { PaginatorModule } from 'primeng/paginator';
import { NoRecordFoundComponent } from '../no-record-found/no-record-found.component';
import { FormsModule } from '@angular/forms';
import { PermissionsService } from '@shared/services/PermissionsService';
import { PermissionsActions } from '@shared/constants/permissionsActions.constant';
import { currentUser } from '@shared/utils/current-user';

@Component({
  selector: 'app-custom-list',
  standalone: true,
  imports: [CommonModule, FeathericonComponent, RouterModule, NoRecordFoundComponent, PaginatorModule, FormsModule],
  templateUrl: './custom-list.component.html',
  styleUrl: './custom-list.component.scss',
  providers: []
})
export class CustomListComponent implements OnChanges {

  @Input() pageData: any[] = [];
  @Output() handleViewAction = new EventEmitter<void>();

  public tasks = [];
  public isopen: boolean = false;
  canProceed: boolean = false;
  canCreateJobId: boolean = false;
  pageId: number | null = null;
  first: number = 0;
  rows: number = 10;
  pageDetails: any[] = [];
  searchText: string = '';
  filteredData: any[] = [];
  canViewDetails: boolean = false;

  constructor(private route: ActivatedRoute, private permissionsService: PermissionsService,) {
  }

  ngOnInit() {

    this.route.data.subscribe(data => {
      this.pageId = data['pageId']; // Retrieve pageId from route data

      const roleId = currentUser().role_id
      if (roleId) {
        this.canViewDetails = true;
      } else {
        if (this.pageId) {
          // Check permissions based on the retrieved pageId
          this.canViewDetails = this.permissionsService.hasPermission(this.pageId, PermissionsActions.VIEW_DETAILS.name);
        }
      }

    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageData']) {
      this.filteredData = [...this.pageData];
      this.updatePageData();
    }
    // if (changes['pageData'])
    //   this.updatePageData()
  }

  viewDetails(data: any) {
    this.handleViewAction.emit(data);
  }

  updatePageData() {
    // this.pageDetails = this.pageData.slice(this.first, this.first + this.rows);
    this.pageDetails = this.filteredData.slice(this.first, this.first + this.rows);

  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePageData();
  }

  applySearch() {
    const query = this.searchText.trim().toLowerCase();

    if (!query) {
      this.filteredData = [...this.pageData];
    } else {
      this.filteredData = this.pageData.filter(port =>
        port.port_name?.toLowerCase().includes(query) ||
        port.port_code?.toLowerCase().includes(query) ||
        (port.is_ebs_uploaded == 1 ? 'uploaded' : 'not uploaded').includes(query)
      );
    }

    // Reset pagination
    this.first = 0;

    // Update current page view
    this.updatePageData();
  }


}
