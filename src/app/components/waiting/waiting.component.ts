import {Component, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit {

    constructor(private platform: Platform, private router: Router) {
    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.router.navigateByUrl('/login');
        });
    }
}
