import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
/*
When the user is logged in he is automatically send to the home screen if he navigates to the Login/Register page
 */
export class RegisteredGuard implements CanActivate {

    constructor(private router: Router, private auth: AuthService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.auth.isLoggedIn()) {
            this.router.navigateByUrl('/home');
            return false;
        }
        return true;
    }
}
