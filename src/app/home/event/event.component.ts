import {Component, Input, OnInit} from '@angular/core';
import {TimelineEvent} from '../../model/timeline-event';
import {EventPopoverComponent} from '../event-popover/event-popover.component';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit {
  timeLineEvents: TimelineEvent[];
  timeLinePeriods: TimelineEvent[];
  currentPopover = null;

  @Input() set events(events: TimelineEvent[]) {
    if (events){
      this.timeLinePeriods = events.filter(e => e.periodPart);
      this.timeLineEvents = events.filter(e => !e.periodPart);
    }
  }

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  isPeriodStart(period: TimelineEvent) {
    return period.periodYear === period.year;
  }

  isPeriodEnd(period: TimelineEvent) {
    return period.periodYear === period.endYear;
  }

  async presentPopover(ev: any, timeLineEvent: TimelineEvent) {
    if (this.currentPopover){
      return;
    }
    const popover = await this.popoverController.create({
      component: EventPopoverComponent,
      cssClass: 'event-popover',
      event: ev,
      componentProps: {timeLineEvent},
      showBackdrop: false

    });
    popover.onDidDismiss().then( result => {
      this.currentPopover = null;
    });
    this.currentPopover = popover;
    return await popover.present();
  }

  dismissPopover(){
    if (this.currentPopover){
      this.currentPopover.dismiss().then();
    }
  }
}
