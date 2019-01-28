/*
Used for all of the authentication
 */
import {Injectable} from '@angular/core';
// Custom time management class
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
  }

  public static setToken() {
    localStorage.setItem('logged_in', String(true));
  }

  /* TODO: save for jwt tokens
  // returns when a token expires
  private static getExpiration() {
      return moment(JSON.parse(localStorage.getItem('expires_at')));
  }

  // sets the user_token and the "time it expires" in the localStorage of the user
  private static setToken(result) {
      const expiresAt = moment().add(result.expiresIn, 'second');
      localStorage.setItem('user_token', result.userToken);
      localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  // validate if the user_token is defined or if the user_token is valid
  isLoggedIn(): boolean {
      if (localStorage.getItem('user_token') !== undefined && localStorage.getItem('user_token') !== null) {
          return moment().isBefore(AuthService.getExpiration());
      }
      return false;
  }

  // TODO: if user cant login a condition path should be made else there will be errors
  login(mail: string, pwd: string) {
      this.httpService.login(mail, pwd).subscribe(item => {
          console.log(item);
          AuthService.setToken(item);
      });
  }

  // Guard to block the user from entering sites he isn't allowed to
  canActivate(): boolean {
      if (localStorage.getItem('user_token') !== undefined && localStorage.getItem('user_token') !== null) {
          return moment().isBefore(AuthService.getExpiration());
      }
      // when the user isn't logged in he will automatically put back to the register page
      this.router.navigate(['register']);
      return false;
  }

  // removes the user_token and the time it expires from the localStorage
  logout() {
      localStorage.removeItem('user_token');
      localStorage.removeItem('expires_at');
  }
  */

  logout() {
    localStorage.removeItem('logged_in');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('logged_in') !== undefined && localStorage.getItem('logged_in') !== null;
  }
}
