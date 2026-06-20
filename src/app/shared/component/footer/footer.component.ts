import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    imports: [DatePipe, CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

    public today: number = Date.now();
    

}
