import {CalendarComponent} from 'ionic2-calendar/calendar';
import {Component, ViewChild, OnInit, Inject, LOCALE_ID} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {formatDate} from '@angular/common';

@Component({
    selector: 'app-calender',
    templateUrl: './calender.component.html',
    styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {
    event = {
        title: '',
        desc: '',
        startTime: '',
        endTime: '',
        allDay: false
    };

    minDate = new Date().toISOString();

    eventSource = [];
    viewTitle;
    collapseCard = true;

    calendar = {
        mode: 'month',
        currentDate: new Date(),
    };

    @ViewChild(CalenderComponent) myCal: CalenderComponent;

    constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string) {
    }

    eventCopy;

    ngOnInit() {
        this.eventCopy = JSON.parse(localStorage.getItem('newEvent'));
    }

    resetEvent() {
        this.event = {
            title: '',
            desc: '',
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            allDay: false
        };
    }

    // Create the right event format and reload source
    addEvent() {
        this.eventCopy = {
            title: this.event.title,
            startTime: new Date(this.event.startTime),
            endTime: new Date(this.event.endTime),
            allDay: this.event.allDay,
            desc: this.event.desc
        };


        if (this.eventCopy.allDay) {
            const start = this.eventCopy.startTime;
            const end = this.eventCopy.endTime;

            this.eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
            this.eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
        }

        this.eventSource.push(this.eventCopy);
       // this.myCal.ngOnInit();
        this.resetEvent();
        localStorage.setItem('newEvent', JSON.stringify(this.eventCopy));
    }


    // Change current month/week/day
    next() {
        const swiper = document.querySelector('.swiper-container')['swiper'];
        swiper.slideNext();
    }

    back() {
        const swiper = document.querySelector('.swiper-container')['swiper'];
        swiper.slidePrev();
    }

// Change between month/week/day
    changeMode(mode) {
        this.calendar.mode = mode;
    }

// Focus today
    today() {
        this.calendar.currentDate = new Date();
    }

// Selected date reange and hence title changed
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

// Calendar event was clicked
    async onEventSelected(event) {
        // Use Angular date pipe for conversion
        const start = formatDate(event.startTime, 'medium', this.locale);
        const end = formatDate(event.endTime, 'medium', this.locale);

        const alert = await this.alertCtrl.create({
            header: event.title,
            subHeader: event.desc,
            message: 'From: ' + start + '<br><br>To: ' + end,
            buttons: ['OK']
        });
        alert.present();
    }

// Time slot was clicked
    onTimeSelected(ev) {
        const selected = new Date(ev.selectedTime);
        this.event.startTime = selected.toISOString();
        selected.setHours(selected.getHours() + 1);
        this.event.endTime = (selected.toISOString());
    }

}
