import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiLanguageService } from '@shared/_http/language.service';
import { TableComponent } from '@shared/component/table/table.component';
import { LanguageDetailsData } from '@shared/configs/language-config';
import { RowData } from '@shared/models/table';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-language',
  imports: [TableComponent],
  templateUrl: './language.component.html',
  styleUrl: './language.component.scss'
})
export class LanguageComponent {
  LanguageDetailsData: RowData = LanguageDetailsData;
  subs: any;

  constructor(private router: Router, private languageService: ApiLanguageService) { }


  ngOnInit(): void {
    this.subs = new Subscription()
    this.getAllLanguage();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  getAllLanguage() {
    this.subs.add(this.languageService.getAllLanguages().subscribe({
      next: (value) => {
        this.LanguageDetailsData.data = value.data;
      }
    }))
  }

  handleCreateAction() {
    this.router.navigateByUrl("/language/create")
  }

  handleDeleteAction(event: any) {
    this.subs.add(this.languageService.deleteLanguage(event).subscribe({
      next: (value) => {
        this.getAllLanguage()
      }
    }))
  }

  handleEditAction(event: any) {
    this.router.navigateByUrl(`/language/edit/${event}`)
  }

  handleViewAction(event: any) {
    this.router.navigateByUrl(`/language/view/${event}`)
  }
}
