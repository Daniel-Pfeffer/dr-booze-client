import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {DataService} from '../services/data.service';

@Injectable({
    providedIn: 'root'
})
/*
When the user isn't logged in yet he is automatically send to the register page if he
 want to access any of the pages requiring a login
 */
export class NeedRegisterGuard implements CanActivate {

    constructor(private router: Router,
                private data: DataService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<boolean> | Promise<boolean> | boolean {
        if (!this.data.existsData('auth')) {
            this.router.navigateByUrl('/register');
            return false;
        }
        return true;
    }
}
