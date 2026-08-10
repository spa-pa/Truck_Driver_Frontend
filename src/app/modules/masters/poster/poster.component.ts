import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PosterService } from "@shared/_http/poster.service";
import { TableComponent } from "@shared/component/table/table.component";
import { PosterDetailsData } from "@shared/configs/poster-config";
import { RowData } from "@shared/models/table";
import { ToastService } from "@shared/services/toast.service";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ItemDetailDialogComponent } from "../../../shared/component/item-detail-dialog/item-detail-dialog.component";
@Component({
  selector: "app-poster",
  imports: [TableComponent],
  templateUrl: "./poster.component.html",
  styleUrl: "./poster.component.scss",
})
export class PosterComponent implements OnInit {
  PosterDetailsData: RowData = PosterDetailsData;
  subs: any;

  constructor(
    private router: Router,
    private posterService: PosterService,
    private toastService: ToastService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.subs = new Subscription();
    this.getAllPosters();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
            language_name: item.language?.language_name || "-",
          }));
        },
      }),
    );
  }

  // handleViewImage(posterId: any) {
  //   const poster = this.PosterDetailsData.data.find(
  //     (p: any) => p.poster_id === posterId,
  //   );
  //   if (poster && poster.poster_path) {
  //     window.open(poster.poster_path, "_blank");
  //   }
  // }

   handleViewImage(posterId: any) {
    const poster = this.PosterDetailsData.data.find(
      (p: any) => p.poster_id === posterId,
    );
    if (poster && poster.poster_path) {
      const dialogConfig: MatDialogConfig = {
        maxWidth: "80vw",
        maxHeight: "90vh",
        width: "100%",
        height: "100%",
        data: {
          key: "Poster",
          value: poster.poster_id,
          img: poster.poster_path,   // can be a URL or base64 string
          img_name: poster.poster_name || "poster",
        },
        autoFocus: true,
        disableClose: true,
        panelClass: "custom-dialog-container",
      };

      this.dialog.open(ItemDetailDialogComponent, dialogConfig);
    }
  }

  handleCreateAction() {
    this.router.navigateByUrl("/poster/create");
  }

  handleDeleteAction(event: any) {
    this.subs.add(
      this.posterService.deletePoster(event).subscribe({
        next: (response) => {
          if (response.success) {
            this.toastService.open(response.message, "success");
            this.getAllPosters();
          } else {
            this.toastService.open(
              response.message || "Deletion failed",
              "error",
            );
          }
        },
        error: (err) => {
          this.toastService.open(
            "An error occurred while deleting the poster.",
            "error",
          );
        },
      }),
    );
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/poster/edit/${event}`);
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/poster/view/${event}`);
  }
}
