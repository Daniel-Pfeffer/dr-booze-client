import {Component} from '@angular/core';
import {PermilleCalculationService} from '../../services/permille-calculation.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {StorageType} from '../../data/enums/StorageType';


@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {

    data = [];
    daydata = [];
    weekdata = [];
    monthdata = [];
    daycolor = 'primary';
    weekcolor = 'light';
    monthcolor = 'light';

    private cocktailCount = 0;
    private liquorCount = 0;
    private wineCount = 0;
    private beerCount = 0;

    statsHere = false;

    distribution = [
        ['Beer', 1],
        ['Wine', 1],
        ['Liquor', 1],
        ['Cocktail', 1]
    ];

    barOptions = {
        legend: {'position': 'none'},
        chartArea: {left: '10%', width: '85%'},
        vAxis: {textStyle: {fontSize: 11, bold: true}},
        hAxis: {textStyle: {fontSize: 11, bold: true}},
        colors: ['ed6f71'],
    };

    pieOptions = {
        pieSliceText: 'none',
        height: 350,
        width: 500
    };
    private item: number;
    private temp: any;


    constructor(private permilleCalculationService: PermilleCalculationService, private router: Router, private dataservice: DataService) {

        if (this.dataservice.exist(StorageType.DAY)) {
            this.daydata = dataservice.get(StorageType.DAY);
        }
        if (this.dataservice.exist(StorageType.WEEK)) {
            this.weekdata = this.dataservice.get(StorageType.WEEK);
        }
        if (this.dataservice.exist(StorageType.MONTH)) {
            this.monthdata = this.dataservice.get(StorageType.MONTH);
        }
        if (this.dataservice.exist(StorageType.BEER)) {
            this.beerCount = this.dataservice.get(StorageType.BEER).length;
        }
        if (this.dataservice.exist(StorageType.WINE)) {
            this.wineCount = this.dataservice.get(StorageType.WINE).length;
        }
        if (this.dataservice.exist(StorageType.LIQUOR)) {
            this.liquorCount = this.dataservice.get(StorageType.LIQUOR).length;
        }
        if (this.dataservice.exist(StorageType.COCKTAIL)) {
            this.cocktailCount = this.dataservice.get(StorageType.COCKTAIL).length;
        }


        this.distribution[0][1] = this.beerCount;
        this.distribution[1][1] = this.wineCount;
        this.distribution[2][1] = this.liquorCount;
        this.distribution[3][1] = this.cocktailCount;

        this.permilleCalculationService.statisticObservable.subscribe(item => {

            if (item !== null) {
                this.item = item;

                if (this.daydata.length === 0) {
                    this.daydata[0] = [new Date().getSeconds() + '-' + (new Date().getSeconds() + 1), item];
                } else {
                    this.calcDay(item);
                }

                if (this.weekdata.length === 0) {
                    this.weekdata[0] = [new Date().getMinutes() + '-' + (new Date().getMinutes() + 1), item];
                } else {
                    this.calcWeek(item);
                }
                if (this.monthdata.length === 0) {
                    this.monthdata[0] = [new Date().getHours() + '-' + (new Date().getHours() + 1), item];
                } else {
                    this.calcMonth(item);
                }

            }
        });


        this.changeToDay();


    }


    changeColor(format: String) {

        switch (format) {
            case 'Day':
                this.daycolor = 'primary';
                this.weekcolor = 'light';
                this.monthcolor = 'light';
                this.calcWeek(this.item);
                this.calcMonth(this.item);
                this.changeToDay();

                break;

            case 'Week':
                this.daycolor = 'light';
                this.weekcolor = 'primary';
                this.monthcolor = 'light';
                this.changeToWeek();
                break;

            case 'Month':
                this.daycolor = 'light';
                this.weekcolor = 'light';
                this.monthcolor = 'primary';
                this.changeToMonth();
                break;

        }

        // this.forceRedraw();
    }

    changeToDay() {
        if (this.daydata.length > 7) {
            this.temp = this.daydata.slice(this.daydata.length - 7);
            this.data = this.temp;
            this.temp = [];
        } else {
            this.data = this.daydata;
        }
        this.dataservice.set(StorageType.DAY, this.daydata);
    }

    changeToWeek() {
        if (this.weekdata.length > 7) {
            this.temp = this.weekdata.slice(this.weekdata.length - 7);

            this.data = this.temp;


            this.temp = [];
        } else {
            this.data = this.weekdata;
        }
        this.dataservice.set(StorageType.WEEK, this.weekdata);
    }

    changeToMonth() {
        this.data = this.monthdata;
        this.dataservice.set(StorageType.MONTH, this.monthdata);
    }

    forceRedraw() {
        Object.assign(this.data, []);
    }


    private calcDay(item: number) {

        const lastEntry = this.daydata[this.daydata.length - 1];
        const timestamp = new Date().getSeconds();

        if (lastEntry === undefined) {
            this.statsHere = false;
        } else {
            if (lastEntry[0] === timestamp + '-' + (timestamp + 1)) {
                if (lastEntry[1] < item) {

                    this.daydata[this.daydata.length - 1] = ([lastEntry[0], item]);
                }
            } else {

                if (timestamp !== 59) {
                    console.log(timestamp + '-' + (timestamp + 1), item);
                    this.daydata.push([timestamp + '-' + (timestamp + 1), item]);
                } else {
                    this.daydata.push([timestamp + '- 0', item]);
                }
            }
            this.statsHere = true;
        }
        // this.forceRedraw();


    }


    private calcWeek(item: number) {

        const lastEntry = this.weekdata[this.weekdata.length - 1];
        const timestamp = new Date().getMinutes();

        if (lastEntry === undefined) {
            this.statsHere = false;
        } else {
            if (lastEntry[0] === timestamp + '-' + (timestamp + 1)) {
                if (lastEntry[1] < item) {

                    this.weekdata[this.weekdata.length - 1] = ([lastEntry[0], item]);
                }
            } else {

                if (timestamp !== 59) {
                    console.log(timestamp + '-' + (timestamp + 1), item);
                    this.weekdata.push([timestamp + '-' + (timestamp + 1), item]);
                } else {
                    this.weekdata.push([timestamp + '- 0', item]);
                }
            }

            this.statsHere = true;
        }
    }

    private calcMonth(item: number) {


        const lastEntry = this.weekdata[this.weekdata.length - 1];
        const timestamp = new Date().getHours();

        if (lastEntry === undefined) {
            this.statsHere = false;
        } else {
            if (lastEntry[0] === timestamp + '-' + (timestamp + 1)) {
                if (lastEntry[1] < item) {

                    this.monthdata[this.monthdata.length - 1] = ([lastEntry[0], item]);
                }
            } else {

                if (timestamp !== 23) {
                    console.log(timestamp + '-' + (timestamp + 1), item);
                    this.monthdata.push([timestamp + '-' + (timestamp + 1), item]);
                } else {
                    this.monthdata.push([timestamp + '- 0', item]);
                }
            }
            // this.forceRedraw();

        }
        this.statsHere = true;
    }


}
