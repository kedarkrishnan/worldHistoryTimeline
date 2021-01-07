import {Component, OnInit} from '@angular/core';
import {NavParams} from '@ionic/angular';
import {TimelineEvent} from '../../model/timeline-event';

@Component({
  selector: 'app-event-popover',
  templateUrl: './event-popover.component.html',
  styleUrls: ['./event-popover.component.scss'],
})
export class EventPopoverComponent implements OnInit {
  timeLineEvent: TimelineEvent;



  constructor(private navParams: NavParams) {
    this.timeLineEvent = navParams.data.timeLineEvent;
  }

  ngOnInit() {}

  getYearSummary() {
    const endDate = this.timeLineEvent.endDate ? this.timeLineEvent.endDate + ' ' + this.timeLineEvent.endYear : this.timeLineEvent.endYear;
    let yearSummary = this.timeLineEvent.date ? this.timeLineEvent.date + ' ' + this.timeLineEvent.year : this.timeLineEvent.year;
    yearSummary = endDate ? yearSummary + ' - ' + endDate : yearSummary;
    return yearSummary;
  }
}
