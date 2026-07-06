import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExpiryConfigService } from '@shared/_http/expiry-config.service';
import { ExpiryConfigDetailsData } from '@shared/configs/expiry-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-expiry-config',
  templateUrl: './expiry-config.component.html',
  styleUrl: './expiry-config.component.scss',
  standalone: false
})
export class ExpiryConfigComponent {
  ExpiryConfigDetailsData: RowData = ExpiryConfigDetailsData;
  subs: any;

  constructor(private router: Router, private expiryConfigService: ExpiryConfigService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllExpiryConfig();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllExpiryConfig() {
    this.subs.add(this.expiryConfigService.getAllExpiryConfig().subscribe({
      next: (value) => {
        this.ExpiryConfigDetailsData.data = value.data;
      }
    }))
  }

  handleCreateAction() {
    this.router.navigateByUrl("/expiry-config/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.expiryConfigService.deleteExpiryConfig(event).subscribe({
      next: (value) => {
        this.getAllExpiryConfig()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/expiry-config/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/expiry-config/view/${event}`)
  }
}
