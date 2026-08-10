import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClickOutsideDirective } from '../../../directives/outside.directive';
import { currentUser } from '@shared/utils/current-user';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterModule, ClickOutsideDirective],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  public profile: boolean = false;
  public profileDetails: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.profileDetails = currentUser();
  }

  open() {
    this.profile = !this.profile
  }

  clickOutside(): void {
    this.profile = false;
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/auth/login'])
  }

}
