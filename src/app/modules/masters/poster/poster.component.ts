import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PosterService } from '@shared/_http/poster.service';
import { TableComponent } from '@shared/component/table/table.component';
import { PosterDetailsData } from '@shared/configs/poster-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-poster',
  imports: [TableComponent],
  templateUrl: './poster.component.html',
  styleUrl: './poster.component.scss',
})
export class PosterComponent implements OnInit{
  PosterDetailsData: RowData = PosterDetailsData;
  subs: any;

  constructor(private router: Router, private posterService: PosterService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllPosters();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  // getAllPosters() {
  //   this.subs.add(this.posterService.getAllPosters().subscribe({
  //     next: (value) => {
  //       this.PosterDetailsData.data = value.data;
  //     }
  //   }))
  // }

  getAllPosters() {
  this.subs.add(
    this.posterService.getAllPosters().subscribe({
      next: (value) => {
        this.PosterDetailsData.data = value.data.map((item: any) => ({
          ...item,
          language_name: item.language?.language_name || '-'
        }));
      }
    })
  );
}

handleViewImage(posterId: any) {
  const poster = this.PosterDetailsData.data.find((p: any) => p.poster_id === posterId);
  if (poster && poster.poster_path) {
    window.open(poster.poster_path, '_blank');
  }
}


  handleCreateAction() {
    this.router.navigateByUrl("/poster/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.posterService.deletePoster(event).subscribe({
      next: (value) => {
        this.getAllPosters()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/poster/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/poster/view/${event}`)
  }
}
