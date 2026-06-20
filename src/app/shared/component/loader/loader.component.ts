import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-loader',
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss'
})
export class LoaderComponent {

  public show: boolean = true;

  constructor() {
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }

}
