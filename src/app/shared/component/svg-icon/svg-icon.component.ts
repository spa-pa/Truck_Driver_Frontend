import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-svg-icon',
    imports: [CommonModule],
    templateUrl: './svg-icon.component.html',
    styleUrl: './svg-icon.component.scss'
})
export class SvgIconComponent {

  @Input("icon") public icon: string | undefined;

  getSvgType() {
    return document.getElementsByClassName("sidebar-wrapper")[0].getAttribute("icon") == "stroke-svg";
  }

}
