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
    drinks = [];
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


        // updates counts for ex. beercount
        this.getDist();

        // changes the distribution to the updated counts
        this.distribution[0][1] = this.beerCount;
        this.distribution[1][1] = this.wineCount;
        this.distribution[2][1] = this.liquorCount;
        this.distribution[3][1] = this.cocktailCount;


        this.permilleCalculationService.statisticObservable.subscribe(item => {

            this.forceRedraw();

            if (item !== null) {
                this.item = item;
                // adds te first elements so that the data-array is not empty
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

        // changes to display the day statistics for default
        this.changeToDay();


    }

    // chages focused color of the tabs and recalculates the selected datas
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

    // displays the last days
    // TODO change to real days
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

    // displays the last weeks
    // TODO change to real weeks
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

    // displays the last month
    // TODO change to real month
    changeToMonth() {
        this.data = this.monthdata;
        this.dataservice.set(StorageType.MONTH, this.monthdata);
    }

    forceRedraw() {
        Object.assign(this.data, []);
        Object.assign(this.distribution, []);

    }

    // checks if the value is valid
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

    // checks if the value is valid
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

    // checks if the value is valid
    private calcMonth(item: number) {
        const lastEntry = this.monthdata[this.monthdata.length - 1];
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

    // iterates the drinks to update the counts for the piechart
    private getDist() {
        this.wineCount = 0;
        this.beerCount = 0;
        this.liquorCount = 0;
        this.cocktailCount = 0;
        this.drinks = this.dataservice.get(StorageType.DRINKS);
        for (const drink of this.drinks) {
            switch (drink.alcohol.type) {
                case 'BEER':
                    this.beerCount++;
                    break;
                case 'COCKTAIL':
                    this.cocktailCount++;
                    break;
                case 'LIQUOR':
                    this.liquorCount++;
                    break;
                case 'WINE':
                    this.wineCount++;
                    break;
            }
        }
    }
}
