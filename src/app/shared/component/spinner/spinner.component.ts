
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@shared/services/loader.service';


@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  isLoading$ = this.loaderService.isLoading$;

  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
  }
}
