import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PublicAccessGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Allow access to public routes
    return true;
  }
}