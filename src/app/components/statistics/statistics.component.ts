import {Component, OnInit} from '@angular/core';
import {Moment} from 'moment';

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
    private sorted: any;
    timestamp : String;
    private statisticCheat = 1;

    hasDayData = true;

    constructor() {
        this.daydata = JSON.parse(localStorage.getItem('permilleStorage'));
        if (this.daydata !== undefined && this.daydata !== null) {

            this.daydata.reverse();
            this.timestamp = this.daydata[0].time.split("&")[1];
            this.data[0] = [this.timestamp,0,this.daydata[0].permille];
            this.focusAvg = this.daydata[0].permille;
            this.data.reverse();
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
            if(this.daydata.length === 0 ){
                this.maxValue = 1;
            } else {
                this.maxValue = this.daydata.length-1;
            }
            this.daydata = JSON.parse(localStorage.getItem('permilleStorage'));
            this.daydata.reverse();
            for (let i = 0; i < this.value; i++){

                this.timestamp = this.daydata[i].time.split("&")[1];
                this.data[i] = [this.timestamp,0,this.daydata[i].permille];
            }

            this.data.reverse();
            this.daydata.reverse();
            this.data = Object.assign([], this.data);
            this.lastMaxValue = this.value;
            this.validateStatistic();
        }
    }

    validateStatistik() {
        if (this.hasDayData) {

            for (let i = this.data.length - 1; i > this.data.length - this.value; i--) {
                this.sum += this.data[i][2];
                console.log(this.data[i]);
                console.log(this.data[i].permille);
            }


            if(this.daydata.length == 1) {
                this.focusAvg = Math.trunc(this.sum / 1 * 100) / 100;
                console.log('i am in');
            } else {
                this.focusAvg = Math.trunc(this.sum / this.value * 100) / 100;
            }
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


            this.maxEntry = this.sortdata[this.sortdata.length - this.statistikCheat];
            this.maxEntry.time = this.maxEntry.time.split("&")[1] + ' (' + this.maxEntry.time.split("&")[0]+')';

            this.maxEntry.permille = Math.trunc(this.maxEntry.permille * 100) / 100;
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
        if(this.statistikCheat < this.daydata.length) {
            this.statisticCheat++;
            this.validateStatistic();
        }
    }

    returnToNormal() {
        this.statisticCheat = 1;
        this.validateStatistic();
    }

}
