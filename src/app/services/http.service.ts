/*
Handles ALL HTTP/s-Request
 */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Login} from '../interfaces/login';
import {Register} from '../interfaces/register';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    // Private IP of burgi probably changes all the time pls change
    private ipBorgi = 'http://192.168.137.1:8080/rest/booze/';
    private ipLocal = 'http://localhost:8080/rest/booze/';
    private ipLocalGlobal = 'http://192.168.2.1:8080/rest/booze'; // Help me i don't have a fuccin clue

    constructor(private http: HttpClient) {
    }

    login(username, password) {
        return this.http.post<Login>(this.ipLocalGlobal + 'login', {username, password});
    }

    register(email, password, username) {
        return this.http.post<Register>(this.ipLocalGlobal + 'register', {email, password, username});
    }
}
