import {Component} from '@angular/core';
import {PermilleCalculationService} from '../../services/permille-calculation.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {StorageType} from '../../data/enums/StorageType';
import {HttpService} from '../../services/http.service';
import {AlcoholType} from '../../data/enums/AlcoholType';
import {StatisticType} from '../../data/enums/StatisticType';
import {AlertController, LoadingController} from '@ionic/angular';
import {assertNumber} from '@angular/core/src/render3/assert';

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
    statsHere = false;
    distribution = [];

    barOptions = {
        legend: {'position': 'none'},
        chartArea: {left: '10%', width: '85%'},
        vAxis: {textStyle: {fontSize: 13, bold: true}},
        hAxis: {textStyle: {fontSize: 13, bold: true}},
        colors: ['ed6f71'],
    };
    pieOptions = {
        pieSliceText: 'none',
        chartArea: {width: '85%', height: '60%'},
        height: 450,
        legend: 'none'

    };
    private cocktailCount;
    private liquorCount;
    private wineCount;
    private beerCount;
    private item: number;
    private temp: any;
    private statistic = StatisticType.DAY;
    private screenHeight: number;
    private screenWidth: number;
    private isLoading = false;


    constructor(
        private loadingController: LoadingController,
        private permilleCalculationService: PermilleCalculationService,
        private router: Router,
        private dataservice: DataService,
        private http: HttpService,
        private alert: AlertController) {


        const timestamp = new Date();
        // sets the first Values of all datas
        if (this.daydata.length === 0) {
            if (timestamp.getHours() === 23) {
                this.daydata[0] = [timestamp.getHours() + '-' + 0, 0];
            } else {
                this.daydata[0] = [timestamp.getHours() + '-' + (timestamp.getHours() + 1), 0];
            }
        }
            if (this.weekdata.length === 0) {
                console.log(timestamp.getDay().toString());
                this.weekdata[0] = [timestamp.getDay(), 0];
            }
            if (this.monthdata.length === 0) {
                this.monthdata[0] = [(timestamp.getMonth()), 0];
            }
            // updates distribution for the Pie-Chart

        this.permilleCalculationService.statisticObservable.subscribe(item => {

            if (item !== undefined) {
                this.item = item;
                }
                // updates all data-arrays
                this.calc(item, StatisticType.MONTH);
                this.calc(item, StatisticType.WEEK);
                this.calc(item, StatisticType.DAY);
                this.changeTo(this.statistic);

            this.updateDist();
            this.forceRedraw();
            });

    }

    // Loads in all the data-arrays
    ionViewWillEnter() {
        this.pieOptions.height = window.screen.height / 2;
        if (this.dataservice.exist(StorageType.DAY)) {
            this.daydata = this.dataservice.get(StorageType.DAY);
        }
        if (this.dataservice.exist(StorageType.WEEK)) {
            this.weekdata = this.dataservice.get(StorageType.WEEK);
        }
        if (this.dataservice.exist(StorageType.MONTH)) {
            this.monthdata = this.dataservice.get(StorageType.MONTH);
        }
        if (this.dataservice.exist((StorageType.DIST))) {
            this.distribution = this.dataservice.get(StorageType.DIST);
        } else {
            this.updateDist();
        }

    }

    // saves all the data-arrays
    ionViewWillLeave() {
        this.dataservice.set(StorageType.DAY, this.daydata);
        this.dataservice.set(StorageType.WEEK, this.weekdata);
        this.dataservice.set(StorageType.MONTH, this.monthdata);
        this.dataservice.set(StorageType.DIST, this.distribution);
    }

    // changes focused color of the tabs and recalculates the selected datas
    changeColor(statType: StatisticType) {
        this.statistic = statType;
        switch (statType) {

            case StatisticType.DAY:
                this.daycolor = 'primary';
                this.weekcolor = 'light';
                this.monthcolor = 'light';
                break;

            case StatisticType.WEEK:
                this.daycolor = 'light';
                this.weekcolor = 'primary';
                this.monthcolor = 'light';
                break;

            case StatisticType.MONTH:
                this.daycolor = 'light';
                this.weekcolor = 'light';
                this.monthcolor = 'primary';
                break;
        }
        this.changeTo(statType);

    }

    // parses the data of the selected stat-type into userfriendly data
    changeTo(statType: StatisticType) {
        let temp = [];
        this.data = [];
        switch (statType) {
            case StatisticType.DAY:
                if (this.daydata.length > 7) {
                    temp = this.daydata.slice(this.daydata.length - 7);
                } else {
                    temp = this.daydata;
                }
                for (let i = 0; i < temp.length; i++) {
                    const oneTemp: string = temp[i][0];
                    if (!oneTemp.endsWith('h')) {
                        temp[i][0] += 'h';

                    }
                }
                break;
            case StatisticType.WEEK:
                if (this.weekdata.length > 7) {
                    temp = this.weekdata.slice(this.weekdata.length - 7);
                } else {
                    temp = this.weekdata;

                }
                for (let i = 0; i < temp.length; i++) {
                    switch (temp[i][0]) {
                        case 1:
                            temp[i][0] = 'Mon';
                            break;
                        case 2:
                            temp[i][0] = 'Tue';
                            break;
                        case 3:
                            temp[i][0] = 'Wed';
                            break;
                        case 4:
                            temp[i][0] = 'Thu';
                            break;
                        case 5 :
                            temp[i][0] = 'Fri';
                            break;
                        case 6 :
                            temp[i][0] = 'Sat';
                            break;
                        case 0:
                            temp[i][0] = 'Sun';
                            break;
                    }
                }
                break;
            case StatisticType.MONTH:
                if (this.monthdata.length > 12) {
                    temp = this.monthdata.slice(this.monthdata.length - 7);

                } else {
                    temp = this.monthdata;
                }
                for (let i = 0; i < temp.length; i++) {
                    switch (temp[i][0]) {
                        case 0:
                            temp[i][0] = 'Jan';
                            break;
                        case 1:
                            temp[i][0] = 'Feb';
                            break;
                        case 2:
                            temp[i][0] = 'Mar';
                            break;
                        case 3:
                            temp[i][0] = 'Apr';
                            break;
                        case 4:
                            temp[i][0] = 'May';
                            break;
                        case 5 :
                            temp[i][0] = 'Jun';
                            break;
                        case 6 :
                            temp[i][0] = 'Jul';
                            break;
                        case 7:
                            temp[i][0] = 'Aug';
                            break;
                        case 8:
                            temp[i][0] = 'Sep';
                            break;
                        case 9:
                            temp[i][0] = 'Oct';
                            break;
                        case 10:
                            temp[i][0] = 'Nov';
                            break;
                        case 11:
                            temp[i][0] = 'Dec';
                            break;
                    }
                }
                break;
        }
        Object.assign(this.data, temp);

    }


    forceRedraw() {
        Object.assign(this.data, []);
        Object.assign(this.distribution, this.distribution);

    }


    // iterates the drinks to update the counts for the piechart
    private updateDist() {
        this.wineCount = 0;
        this.beerCount = 0;
        this.liquorCount = 0;
        this.cocktailCount = 0;
        this.http.getAllDrinks().subscribe(drinks => {
            for (const drink of drinks) {
                const type = AlcoholType[drink.alcohol.type];
                switch (type.toString()) {
                    case '0':
                        this.beerCount++;
                        break;
                    case '1':
                        this.wineCount++;
                        break;
                    case '2':
                        this.cocktailCount++;
                        break;
                    case '3' :
                        this.liquorCount++;
                        break;
                }
            }
            this.distribution[0] = ['Beer', this.beerCount];
            this.distribution[1] = ['Wine', this.wineCount];
            this.distribution[2] = ['Liquor', this.liquorCount];
            this.distribution[3] = ['Cocktail', this.cocktailCount];

            this.dataservice.set(StorageType.DIST, this.distribution);
            });


    }

    // updates selected data-array
    private calc(item: number, statType: StatisticType) {
        let isNew = '';
        let timeSpan = '';
        let timestamp;
        switch (statType) {

            case StatisticType.DAY:
                timestamp = new Date().getHours();
                const lastDayEntry = this.daydata[this.daydata.length - 1];
                if (timestamp > lastDayEntry[0].split('-', 1)[0]) {
                    isNew = 'push';
                }
                if (timestamp.toString() === lastDayEntry[0].split('-', 1)[0] && item > lastDayEntry[1]) {
                    isNew = 'replace';
                }
                if (timestamp === 23) {
                    timeSpan = timestamp + '-0';
                } else {
                    timeSpan = timestamp + '-' + (timestamp + 1);
                }
                if (isNew === 'push') {
                    this.daydata.push([timeSpan, item]);
                }
                if (isNew === 'replace') {
                    this.daydata[this.daydata.length - 1] = [timeSpan, item];
                }

                break;

            case StatisticType.WEEK:

                timestamp = new Date().getDay();
                const lastWeekEntry = this.weekdata[this.weekdata.length - 1];
                if (timestamp > this.WeekDayToNumber(lastWeekEntry[0])) {
                    isNew = 'push';
                }
                if (timestamp === this.WeekDayToNumber(lastWeekEntry[0]) && item > lastWeekEntry[1]) {
                    isNew = 'replace';
                }


                if (isNew === 'push') {
                    this.weekdata.push([timestamp, item]);
                }
                if (isNew === 'replace') {
                    this.weekdata[this.weekdata.length - 1] = [timestamp, item];
                }
                break;

            case StatisticType.MONTH:
                const time = new Date();
                timestamp = time.getMonth();

                const lastMonthEntry = this.monthdata[this.monthdata.length - 1];

                if (timestamp > this.monthToNumber(lastMonthEntry[0])) {
                    isNew = 'push';

                }
                if (timestamp === this.monthToNumber(lastMonthEntry[0]) && item > lastMonthEntry[1]) {
                    isNew = 'replace';
                }
                if (isNew === 'push') {
                    this.monthdata.push([timestamp, item]);
                }
                if (isNew === 'replace') {
                    this.monthdata[this.monthdata.length - 1] = [timestamp, item];
                }
                break;
        }
        this.changeTo(statType);
    }


    async refresh(event) {
        this.calc(this.item, this.statistic);
        this.updateDist();
        setTimeout(
            () => {
                event.target.complete();
            }, 2000);
    }

    async presentHelpAlert() {

        const alert = await this.alert.create({
            header: 'Statistics',
            message: 'Pie-Chart: <br> Shows the distribution of the different drink types since the first drink.<br>Bar-Chart:<br> shows the highest permille-level you had in 7 hours, 7 days or in the last year. ',
            buttons: ['Got it!']
        });
        await alert.present();
    }


    // TODO find bug and remove workaround
    private WeekDayToNumber(s: string): number {
        switch (s) {
            case 'Mon':
                return 1;
            case 'Tue:':
                return 2;
            case 'Wed':
               return 3;
            case 'Thu':
              return 4;
            case 'Fri' :
                return 5;
            case 'Sat' :
                return 6;
            case 'Sun' :
                return 0;

        }

    }

    private monthToNumber(s: string): number {
        switch (s) {
            case 'Jan':
                return 0;
            case 'Feb':
                return 1;
            case 'Mar':
                return 2;
            case 'Apr':
                return 3;
            case 'May':
                return 4;
            case 'Jun' :
                return 5;
            case 'Jul' :
                return 6;
            case 'Aug':
                return 7;
            case 'Sep':
                return 8;
            case 'Oct':
                return 9;
            case 'Nov':
                return 10;
            case 'Dec':
                return 11;

        }
    }
}
