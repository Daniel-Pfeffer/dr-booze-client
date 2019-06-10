import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

    selectedTab = 'line';


    data = [];
    options = {
        legend: {'position': 'none'},
        chartArea: {left: '10%', width: '85%'},
        vAxis: {textStyle: {fontSize: 11, bold: true}},
        hAxis: {textStyle: {fontSize: 11, bold: true}}
    };
    daydata = [];
    private permille: number;
    private oldpermille: number;
    private time: String;
    value = 10;
    maxValue: number;
    lastMaxValue = -1;
    private sum = 0;
    focusAvg: number;
    overallAvg: number;
    private sortdata: any[];
    private maxEntry: any;
    private littleEntry: any;
    private sampleText: String;
    private viewButton: boolean;
    private statistikCheat = 1;



    constructor() {
        this.daydata = JSON.parse(localStorage.getItem('permilleStorage'));
        this.maxValue = this.daydata.length - 1;
        for (let i = 0; i < 10; i++) {
            this.permille = this.daydata[this.daydata.length - 10 + i].permille;
            this.oldpermille = this.daydata[this.daydata.length - 11 + i].permille;
            this.time = this.daydata[this.daydata.length - 10 + i].time;
            this.data[i] = [this.time, 0, this.permille];
        }
        this.validateStatistik();

    }

    forceRedraw(event) {
        this.value = event.detail.value;
        if (this.lastMaxValue > this.value) {
            this.data = [];
        }
        this.maxValue = this.daydata.length - 1;
        console.log(this.maxValue);

        console.log(this.daydata);
        console.log(this.value);
        for (let i = 0; i < this.value; i++) {
            console.log(this.daydata[this.daydata.length - this.value + i]);
            this.permille = this.daydata[this.daydata.length - this.value + i].permille;
            console.log(this.permille);

            this.oldpermille = this.daydata[this.daydata.length - this.value - 1 + i].permille;
            this.time = this.daydata[this.daydata.length - this.value + i].time;
            this.data[i] = [this.time, 0, this.permille];
            this.data = Object.assign([], this.data);
        }
        this.lastMaxValue = this.value;
        this.validateStatistik();
    }

    validateStatistik() {

        for (let i = this.maxValue; i > this.daydata.length - this.value; i--) {
            this.sum += this.daydata[i].permille;

        }
        this.focusAvg = Math.trunc(this.sum / this.value * 100) / 100;
        this.sum = 0;

        this.sortdata = this.daydata;
        this.sortdata.sort(function sortData(a, b) {
            return a.permille - b.permille;
        });


        for (let i = 0; i < this.sortdata.length - this.statistikCheat + 1; i++) {
            this.sum += this.daydata[i].permille;
        }
        this.overallAvg = Math.trunc(this.sum / this.daydata.length * 100) / 100;
        this.sum = 0;


        this.maxEntry = this.sortdata[this.sortdata.length - this.statistikCheat];
        this.littleEntry = this.sortdata[0];

        this.maxEntry.permille = Math.trunc(this.maxEntry.permille * 100) / 100;
        this.littleEntry.permille = Math.trunc(this.littleEntry.permille * 100) / 100;
        this.createSampleText();
    }


    createSampleText() {

        if (this.overallAvg > 2) {
            this.sampleText = 'Your Average with is with ' + this.overallAvg + ' Permille in a very critical zone. ' +
                'You need to change something about your drinking.';
        } else {

            if (this.maxEntry.permille > this.overallAvg + 1) {
                this.sampleText = 'Your max Permille is way higher than your overall Average. Bingdrinking on one day ' +
                    'is not healthy for your body either.';
            }
            if (this.maxEntry.permille <= this.overallAvg + 1 && this.overallAvg <= 1) {
                this.sampleText = 'Your drinking behaviour is in the norm, but you could still do better... we believe in you!';
            }
        }
    }

    suspendMax() {
        this.statistikCheat++;
        this.validateStatistik();
    }

    returnToNormal() {
        this.statistikCheat = 1;
        this.validateStatistik();
    }

    ngOnInit() {
    }


}

