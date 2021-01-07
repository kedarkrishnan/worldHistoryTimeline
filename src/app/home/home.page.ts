import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TimelineEvent} from '../model/timeline-event';
import {Continent} from '../model/continent.enum';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  continents = Continent;
  years: number[];
  events: Map<string, TimelineEvent[]> = new Map<string, TimelineEvent[]>();

  constructor(private http: HttpClient) {
      const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
      this.years = range( 1200, 2021, 1);
      this.years.reverse();

      this.http.get<TimelineEvent[]>('assets/db/timeline.json').subscribe(data => {
          data.forEach(event => {
              const key = event.continent + event.year;
              const events = this.events.get(key) || [];
              events.push(event);
              this.events.set(key, events);
              if ( event.endYear){
                  this.setTimelinePeriod(event);
              }
          });
          console.log(this.events);
      });
  }

    private setTimelinePeriod(event: TimelineEvent) {
      let year = event.year;
      while ( year <= event.endYear){
          event = JSON.parse(JSON.stringify(event));
          event.periodPart = true;
          event.periodYear = year;
          const key = event.continent + year;
          const events = this.events.get(key) || [];
          events.push(event);
          this.events.set(key, events);
          year = year + 1;
      }
    }

    getEvent(year: number, continent: Continent): TimelineEvent[] {
        return this.events.get(continent + year);
    }

    isDecade(year: number) {
        return year % 100 === 0;
    }
}
