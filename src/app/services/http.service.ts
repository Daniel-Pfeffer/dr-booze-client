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

    // private IP of burgi probably changes all the time pls change if changed
    private ipBorgi = 'http://192.168.137.1:8080/rest/booze/';
    private ipLocal = 'http://localhost:8080/rest/booze/';
    private ipLocalGlobal = 'http://192.168.2.1:8080/rest/booze/'; // help me i don't have a fuccin clue

    constructor(private http: HttpClient) {
    }

    login(username, password) {
        return this.http.post<Login>(this.ipLocalGlobal + 'login', {username, password});
    }

    register(email, password, username) {
        return this.http.post<Register>(this.ipLocalGlobal + 'register', {email, password, username});
    }

    insertData(birthday, weight, height, gender, firstname?, lastName?) {
        console.log(`bday: ${birthday}\nweight: ${weight}\nheight: ${height}\ngender: ${gender}\nfirstname: ${firstname}\nlastName: ${lastName}`);
        // return this.http.post(this.ipLocal + 'insertDetails', {birthday, weight, height, gender, firstname, lastName});
    }
}
