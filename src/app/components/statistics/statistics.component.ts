import {Component} from '@angular/core';
import {PermilleCalculationService} from '../../services/permille-calculation.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {StorageType} from '../../data/enums/StorageType';
import {HttpService} from '../../services/http.service';
import {AlcoholType} from '../../data/enums/AlcoholType';
import {StatisticType} from '../../data/enums/StatisticType';
import {AlertController} from '@ionic/angular';


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
        vAxis: {textStyle: {fontSize: 11, bold: true}},
        hAxis: {textStyle: {fontSize: 11, bold: true}},
        colors: ['ed6f71'],
    };
    pieOptions = {
        pieSliceText: 'none',
        chartArea: { width: '100%', height: '80%'},
        height: 400,
        legend: 'none'

    };
    private cocktailCount;
    private liquorCount;
    private wineCount;
    private beerCount;
    private item: number;
    private temp: any;
    private statistic = StatisticType.DAY;


    constructor(
        private permilleCalculationService: PermilleCalculationService,
        private router: Router,
        private dataservice: DataService,
        private http: HttpService,
        private alert: AlertController) {

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
        }
        // updates counts for ex. beercount
        // changes the distribution to the updated counts

        this.permilleCalculationService.statisticObservable.subscribe(item => {
            this.forceRedraw();
            const timestamp = new Date();
            if (item !== null) {
                this.item = item;
                // adds te first elements so that the data-array is not empty
                if (this.daydata.length === 0) {
                    this.daydata[0] = [ timestamp.getHours() + '-' + (timestamp.getHours() + 1), item];
                }
                if (this.weekdata.length === 0) {
                    this.weekdata[0] = [ timestamp.getDay().toString(), item];
                }
                if (this.monthdata.length === 0) {
                    this.monthdata[0] = [ (timestamp.getMonth()).toString() , item];
                }
                this.getDist();
                this.calc(item, this.statistic);
            }
        });

        // changes to display the day statistics for default
        this.changeTo(StatisticType.DAY);


    }

    // changes focused color of the tabs and recalculates the selected datas
    changeColor(statType: StatisticType) {
        this.statistic = statType;
        switch (statType) {

            case StatisticType.DAY:
                this.daycolor = 'primary';
                this.weekcolor = 'light';
                this.monthcolor = 'light';
                this.calc(this.item, statType);
                this.forceRedraw();


                break;

            case StatisticType.WEEK:
                this.daycolor = 'light';
                this.weekcolor = 'primary';
                this.monthcolor = 'light';
                this.calc(this.item, statType);
                break;

            case StatisticType.MONTH:
                this.daycolor = 'light';
                this.weekcolor = 'light';
                this.monthcolor = 'primary';
                this.calc(this.item, statType);
                break;

        }

        // this.forceRedraw();
    }

    // displays the last days
    // TODO change to real days
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
                case '1':
                    temp[i][0] = 'Mon';
                    break;
                case '2':
                    temp[i][0] = 'Tue';
                    break;
                case '3':
                    temp[i][0] = 'Wed';
                    break;
                case '4':
                    temp[i][0] = 'Thu';
                    break;
                case '5' :
                    temp[i][0] = 'Fri';
                    break;
                case '6' :
                    temp[i][0] = 'Sat';
                    break;
                case '7':
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
                        case '0':
                            temp[i][0] = 'Jan';
                            break;
                        case '1':
                            temp[i][0] = 'Feb';
                            break;
                        case '2':
                            temp[i][0] = 'Mar';
                            break;
                        case '3':
                            temp[i][0] = 'Apr';
                            break;
                        case '4':
                            temp[i][0] = 'May';
                            break;
                        case '5' :
                            temp[i][0] = 'Jun';
                            break;
                        case '6' :
                            temp[i][0] = 'Jul';
                            break;
                        case '7':
                            temp[i][0] = 'Aug';
                            break;
                        case '8':
                            temp[i][0] = 'Sep';
                            break;
                        case '9':
                            temp[i][0] = 'Oct';
                            break;
                        case '10':
                            temp[i][0] = 'Nov';
                            break;
                        case '11':
                            temp[i][0] = 'Dec';
                            break;
                    }
                }
                break;
        }

        Object.assign(this.data, temp);
        this.dataservice.set(StorageType.DAY, this.daydata);
        this.dataservice.set(StorageType.WEEK, this.weekdata);
        this.dataservice.set(StorageType.MONTH, this.monthdata);
    }


    forceRedraw() {
        Object.assign(this.data, []);
        Object.assign(this.distribution, this.distribution);

    }


    // iterates the drinks to update the counts for the piechart
    private getDist() {
        this.wineCount = 0;
        this.beerCount = 0;
        this.liquorCount = 0;
        this.cocktailCount = 0;
        this.http.getDrinks().subscribe(drinks => {
            console.log(drinks);
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

    private calc(item: number, statType: StatisticType) {
        console.log(statType);
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
                if (timestamp === 23 ) {
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
                if (timestamp > lastWeekEntry[0]) {
                    isNew = 'push';
                }
                if (timestamp === lastWeekEntry[0] && item > lastWeekEntry[1]) {
                    isNew = 'replace';
                }

                if (isNew === 'push') {
                    this.weekdata.push([timestamp.toString(), item]);
                }
                if (isNew === 'replace') {
                    this.weekdata[this.weekdata.length - 1] = [timestamp.toString(), item];
                }
                break;

            case StatisticType.MONTH:
                const time = new Date();
                timestamp = time.getMonth();

                const lastMonthEntry = this.monthdata[this.monthdata.length - 1];

                if (timestamp > lastMonthEntry[0]) {
                isNew = 'push';
                }

                if (timestamp === lastMonthEntry[0] && item > lastMonthEntry[1]) {
                    isNew = 'replace';
                }

                if (isNew === 'push') {
                    this.monthdata.push([timestamp.toString(), item]);
                }
                if (isNew === 'replace') {
                    this.monthdata[this.monthdata.length - 1] = [timestamp.toString(), item];
                }
                break;
        }
        this.changeTo(statType);
    }

    async refresh(event) {
        this.calc(this.item, this.statistic);
        this.getDist();
                setTimeout(
            () => {
                event.target.complete();
        }, 2000);
    }
    async presentHelpAlert() {

        const alert = await this.alert.create({
            header: 'Statistics',
            message: 'Bar-Chart:<br> shows the highest permille-level you had in 7 hours, 7 days or in the last year.<br>Pie-Chart: <br> Shows the distribution of the different drink types since the first drink. ',
            buttons: ['Got it!']
        });
        await alert.present();
    }
}
