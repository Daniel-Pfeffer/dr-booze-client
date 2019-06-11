import {Component} from '@angular/core';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {

    data = [];
    options = {
        legend: {'position': 'none'},
        chartArea: {left: '10%', width: '85%'},
        vAxis: {textStyle: {fontSize: 11, bold: true}},
        hAxis: {textStyle: {fontSize: 11, bold: true}}
    };
    daydata = [];
    flipdata = [];
    private permille: number;
    value = 1;
    maxValue: number;
    lastMaxValue = -1;
    private sum = 0;
    focusAvg: number;
    overallAvg: number;
    private sortdata: any[];
    private maxEntry: any;
    private littleEntry: any;
    private sampleText = '';
    private statisticCheat = 1;

    hasDayData = true;

    constructor() {
        this.daydata = JSON.parse(localStorage.getItem('permilleStorage'));
        console.log(this.daydata);
        if (this.daydata !== undefined && this.daydata !== null) {
            this.daydata.reverse();
            for (let i = 0; i < this.value; i++) {
                this.flipdata[i] = [this.daydata[i].time, 0, this.daydata[i].permille];
            }
            this.flipdata.reverse();
            this.data = this.flipdata;
            this.daydata.reverse();

            this.validateStatistic();
        } else {
            this.hasDayData = false;
        }
    }

    forceRedraw(event) {
        this.data = [];
        if (this.hasDayData) {
            this.value = event.detail.value;
            if (this.lastMaxValue > this.value) {
                this.data = [];
            }
            this.maxValue = this.daydata.length - 1;

            this.daydata.reverse();
            for (let i = 0; i < this.value; i++) {
                this.flipdata[i] = [this.daydata[i].time, 0, this.daydata[i].permille];
            }
            this.flipdata.reverse();
            this.data = this.flipdata;
            this.daydata.reverse();
            this.data = Object.assign([], this.data);
            this.lastMaxValue = this.value;
            this.validateStatistic();
        }
    }

    validateStatistic() {
        if (this.hasDayData) {
            for (let i = this.maxValue; i > this.daydata.length - this.value; i--) {
                this.sum += this.daydata[i].permille;
            }
            this.focusAvg = Math.trunc(this.sum / this.value * 100) / 100;
            this.sum = 0;

            this.sortdata = this.daydata;
            this.sortdata.sort(function sortData(a, b) {
                return a.permille - b.permille;
            });

            for (let i = 0; i < this.sortdata.length - this.statisticCheat + 1; i++) {
                this.sum += this.daydata[i].permille;
            }
            this.overallAvg = Math.trunc(this.sum / this.daydata.length * 100) / 100;
            this.sum = 0;

            this.maxEntry = this.sortdata[this.sortdata.length - this.statisticCheat];
            this.littleEntry = this.sortdata[0];

            this.maxEntry.permille = Math.trunc(this.maxEntry.permille * 100) / 100;
            this.littleEntry.permille = Math.trunc(this.littleEntry.permille * 100) / 100;
            this.createSampleText();
        }
    }

    createSampleText() {
        if (this.overallAvg > 2) {
            this.sampleText = 'Your Average with is with ' + this.overallAvg + ' Permille in a very critical zone. ' +
                'You need to change something about your drinking.';
        } else {
            if (this.maxEntry.permille > this.overallAvg) {
                this.sampleText = 'Your max Permille is higher than your overall Average. Bingdrinking on one day ' +
                    'is not healthy for your body either.';
            }
            if (this.maxEntry.permille <= this.overallAvg && this.overallAvg <= 0.5) {
                this.sampleText = 'Your drinking behaviour is in the norm, but you could still do better... we believe in you!';
            }
        }
    }

    suspendMax() {
        this.statisticCheat++;
        this.validateStatistic();
    }

    returnToNormal() {
        this.statisticCheat = 1;
        this.validateStatistic();
    }

}
