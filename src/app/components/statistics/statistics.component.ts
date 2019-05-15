import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

    selectedTab = 'line';

    data = [
        ['London', 8136000],
        ['New York', 8538000],
        ['Paris', 2244000],
        ['Berlin', 3470000],
        ['Kairo', 19500000]
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
