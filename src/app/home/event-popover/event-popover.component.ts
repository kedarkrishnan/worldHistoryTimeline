import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams, PopoverController} from '@ionic/angular';
import {TimelineEvent} from '../../model/timeline-event';
import {EventService} from '../../service/event.service';
import {AddEditEventComponent} from '../add-edit-event/add-edit-event.component';

@Component({
  selector: 'app-event-popover',
  templateUrl: './event-popover.component.html',
  styleUrls: ['./event-popover.component.scss'],
})
export class EventPopoverComponent implements OnInit {
  timeLineEvent: TimelineEvent;



  constructor(private navParams: NavParams,
              private eventService: EventService,
              private modalController: ModalController,
              private popoverController: PopoverController) {
    this.timeLineEvent = navParams.data.timeLineEvent;
  }

  ngOnInit() {}

  getYearSummary() {
    const endDate = this.timeLineEvent.endDate ? this.timeLineEvent.endDate + ' ' + this.timeLineEvent.endYear : this.timeLineEvent.endYear;
    let yearSummary = this.timeLineEvent.date ? this.timeLineEvent.date + ' ' + this.timeLineEvent.year : this.timeLineEvent.year;
    yearSummary = endDate ? yearSummary + ' - ' + endDate : yearSummary;
    const totYears = this.timeLineEvent.endYear - this.timeLineEvent.year;
    yearSummary = totYears > 0 ? yearSummary + ' (' +  totYears + ' years)' : yearSummary;
    return yearSummary;
  }

  dismissPopover() {
    this.popoverController.dismiss().then();
  }

  async addEditEvent() {
    const modal = await this.modalController.create({
      component: AddEditEventComponent,
      componentProps: {timeLineEvent: this.timeLineEvent},
      cssClass: 'event-modal'
    });
    modal.present().then();
  }
}
