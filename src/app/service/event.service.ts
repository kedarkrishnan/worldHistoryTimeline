import {Injectable} from '@angular/core';
import {TimelineEvent} from '../model/timeline-event';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {LOCAL_STORAGE_EVENTS_KEY} from '../../environments/constants';
import {ActionType} from '../model/action-type.enum';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: TimelineEvent[];
  eventsMap: Map<string, TimelineEvent[]>;
  eventMapSubject: BehaviorSubject<Map<string, TimelineEvent[]>> = new BehaviorSubject<Map<string, TimelineEvent[]>>(null);

  constructor(private http: HttpClient) {
    this.eventsMap = new Map<string, TimelineEvent[]>();
    this.eventMapSubject.next(this.eventsMap);
    this.setEventsFromStorage();
  }

  getEvents(){
    return this.eventMapSubject.asObservable();
  }

  private setEventsFromStorage(){
    this.events = JSON.parse(localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY));
    this.createEventMap();
  }

  private createEventMap(){
    this.events.forEach(event => {
      const key = event.continent + event.year;
      const events = this.eventsMap.get(key) || [];
      events.push(event);
      this.eventsMap.set(key, events);
      if ( event.endYear){
        this.setTimelinePeriod(event);
      }
    });
    this.eventMapSubject.next(this.eventsMap);
  }

  private setTimelinePeriod(event: TimelineEvent) {
    let year = event.year;
    while ( year <= event.endYear){
      event = JSON.parse(JSON.stringify(event));
      event.periodPart = true;
      event.periodYear = year;
      const key = event.continent + year;
      const events = this.eventsMap.get(key) || [];
      events.push(event);
      this.eventsMap.set(key, events);
      year = year + 1;
    }
  }

  private setEventsFromHttp(){
    this.http.get<TimelineEvent[]>('assets/db/timeline.json').subscribe(data => {
      this.events = data;
      this.saveStorageEvents(this.events);
      this.createEventMap();
    });
  }

  saveStorageEvents(data){
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(data));
  }

  saveStorageEvent(action: ActionType, timeLineEvent: TimelineEvent): Promise<void>{
    return new Promise((resolve, reject) => {
      if (action === ActionType.Add){
        this.events.push(timeLineEvent);
      }
      if (action === ActionType.Delete){
        const index = this.events.findIndex(event => {
          return event.id === timeLineEvent.id;
        });
        console.log('deleting record ', index);
        this.events.splice(index, 1);
      }
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(this.events));
      this.createEventMap();
      resolve();
    });
  }
}
