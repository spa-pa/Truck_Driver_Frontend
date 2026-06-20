import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GlobalConfig } from '@shared/configs/global-config';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        
        const tokenKey = new GlobalConfig().authToken;
        const userToken = localStorage.getItem(tokenKey);
        // If no token found, redirect to login
        if (!userToken) {
            this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        // Token exists and valid
        return true;

    }
}
