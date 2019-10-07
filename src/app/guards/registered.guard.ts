import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DataService} from '../services/data.service';

@Injectable({
    providedIn: 'root'
})
/*
When the user is logged in he is automatically send to the home screen if he navigates to the Login/Register page
 */
export class RegisteredGuard implements CanActivate {

    constructor(private router: Router, private data: DataService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.data.existsData('auth')) {
            this.router.navigateByUrl('/home');
            return false;
        }
        return true;
    }
}
