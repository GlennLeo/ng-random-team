import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const token = localStorage.getItem('access_token');

        if (!token) {
            this.router.navigate(['/auth']);
            return false;
        }

        try {
            const decodedToken = jwtDecode(token);
            const expirationDate = decodedToken.exp ? decodedToken.exp * 1000 : null;

            if (expirationDate && Date.now() >= expirationDate) {
                this.router.navigate(['/auth']);
                return false;
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            this.router.navigate(['/auth']);
            return false;
        }

        return true;
    }
}
