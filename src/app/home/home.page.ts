import {Component} from '@angular/core';
import {TimelineEvent} from '../model/timeline-event';
import {Continent} from '../model/continent.enum';
import {ModalController} from '@ionic/angular';
import {AddEditEventComponent} from './add-edit-event/add-edit-event.component';
import {EventService} from '../service/event.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  continents = Continent;
  years: number[];
  events: Map<string, TimelineEvent[]> = new Map<string, TimelineEvent[]>();

  constructor(private eventService: EventService,
              private modalController: ModalController) {
      const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
      this.years = range( 1200, new Date().getFullYear(), 1);
      this.years.reverse();
      this.eventService.getEvents().subscribe(response => {
          this.events = response;
      });
  }

    getEvent(year: number, continent: Continent): TimelineEvent[] {
        return this.events.get(continent + year);
    }

    isDecade(year: number) {
        return year % 100 === 0;
    }

    async addEditEvent() {
        const modal = await this.modalController.create({
            component: AddEditEventComponent,
            cssClass: 'event-modal'
        });
        modal.present().then();
    }
}
