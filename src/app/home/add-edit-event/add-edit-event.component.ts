import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {TimelineEvent} from '../../model/timeline-event';
import {EventService} from '../../service/event.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionType} from '../../model/action-type.enum';

@Component({
  selector: 'app-add-edit-event',
  templateUrl: './add-edit-event.component.html',
  styleUrls: ['./add-edit-event.component.scss'],
})
export class AddEditEventComponent implements OnInit {
  actionType: ActionType = ActionType.Add;
  timeLineEvent: TimelineEvent;
  eventForm: FormGroup;
  constructor(navParams: NavParams,
              private eventService: EventService,
              private modalController: ModalController,
              private fb: FormBuilder) {
    this.timeLineEvent = navParams.data.timeLineEvent || new TimelineEvent();
    this.actionType = this.timeLineEvent.id ? ActionType.Edit : ActionType.Add;

    const eventDate = this.timeLineEvent.date ? this.timeLineEvent.date + ' ' + this.timeLineEvent.year : this.timeLineEvent.year;
    const eventEndDate = this.timeLineEvent.endDate ? this.timeLineEvent.endDate + ' ' + this.timeLineEvent.endYear
        : this.timeLineEvent.endYear;
    const fields = {
      id: [this.timeLineEvent.id || Date.now()],
      event : [this.timeLineEvent.event, [Validators.required]],
      type: [this.timeLineEvent.type , [Validators.required]],
      continent: [this.timeLineEvent.continent , [Validators.required]],
      country: [this.timeLineEvent.country],
      summary: [this.timeLineEvent.summary],
      eventDate: [eventDate, [Validators.required]],
      eventEndDate: [eventEndDate],
      periodColor: [this.timeLineEvent.periodColor]
    };

    this.eventForm = fb.group(fields);

  }

  ngOnInit() {}

  save() {
    this.updateEventWithFormData();
    console.log('Save event ', this.timeLineEvent);
    this.eventService.saveStorageEvent(this.actionType, this.timeLineEvent).then(() => {
      this.cancel();
    });
  }

  private updateEventWithFormData() {
    const data = this.eventForm.getRawValue();
    console.log('raw data: ', data);
    this.timeLineEvent.id = data.id;
    this.timeLineEvent.event = data.event;
    this.timeLineEvent.type = data.type;
    this.timeLineEvent.continent = data.continent;
    this.timeLineEvent.country = data.country;
    this.timeLineEvent.summary = data.summary;
    this.timeLineEvent.date = null;
    this.timeLineEvent.endDate = null;
    this.timeLineEvent.periodColor = data.periodColor;
    this.setDate(false, data.eventDate);
    if (data.eventEndDate){
      this.setDate(true, data.eventEndDate);
    }
  }
  setDate( isEndDate: boolean, rawDate: string){
    const date = rawDate.toString().split(' ');
    const yearProp = isEndDate ? 'endYear' : 'year';
    const dateProp = isEndDate ? 'endDate' : 'date';
    console.log('date:', date);
    if (date.length === 3){
      // 0:DD 1:MMM 2:YYYY
      this.timeLineEvent[yearProp] = parseInt(date[2], 0);
      this.timeLineEvent[dateProp] = date[0] + ' ' + date[1];
    } else if (date.length === 2){
      // 0:MMM 1:YYYY
      this.timeLineEvent[yearProp] = parseInt(date[1], 0);
      this.timeLineEvent[dateProp] = date[0];
    } else{
      this.timeLineEvent[yearProp] = parseInt(date[0], 0);
    }
  }

  delete() {
    console.log('Delete event ', this.timeLineEvent);
    this.eventService.saveStorageEvent(ActionType.Delete, this.timeLineEvent).then(() => {
      this.cancel();
    });
  }

  cancel() {
    this.modalController.dismiss().then();
  }

  getTitle() {
    return this.actionType === ActionType.Add ? 'New' : 'Edit';
  }

  getButtonName() {
    return this.actionType === ActionType.Add ? 'Create' : 'Update';
  }

}
