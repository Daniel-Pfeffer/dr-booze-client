import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
/*
When the user isn't logged in yet he is automatically send to the register page if he
 want to access any of the pages requiring a login
 */
export class NeedRegisterGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {

  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/register');
      return false;
    }
    return true;
  }
}