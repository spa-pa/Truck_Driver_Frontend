import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TapToTopComponent } from './shared/component/tap-to-top/tap-to-top.component';
import { LoaderComponent } from './shared/component/loader/loader.component';
import { LayoutService } from '@shared/services/layout.service';
import { LoaderService } from '@shared/services/loader.service';
import { SpinnerComponent } from '@shared/component/spinner/spinner.component';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, TapToTopComponent, LoaderComponent,SpinnerComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [LayoutService]
})
export class AppComponent {
    isLoading$ = this.loaderService.isLoading$;
    constructor(private loaderService: LoaderService) { }
}
