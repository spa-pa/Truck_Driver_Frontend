import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CityService } from '@shared/_http/city.service';
import { CityDetailsData } from '@shared/configs/city-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrl: './city.component.scss',
  standalone: false
})
export class CityComponent {
  CityDetailsData: RowData = CityDetailsData;
  subs: any;

  constructor(private router: Router, private cityservice: CityService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllCity();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllCity() {
    this.subs.add(this.cityservice.getAllCity().subscribe({
      next: (value) => {
        this.CityDetailsData.data = value.data;
      }
    }))
  }

  handleCreateAction() {
    this.router.navigateByUrl("/city/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.cityservice.deleteCity(event).subscribe({
      next: (value) => {
        this.getAllCity()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/city/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/city/view/${event}`)
  }
}
