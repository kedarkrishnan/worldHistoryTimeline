import {Continent} from './continent.enum';

export class TimelineEvent {
    id: number;
    year: number;
    endYear: number;
    date: string;
    endDate: string;
    event: string;
    type: string;
    continent: Continent;
    country: string;
    summary: string;
    periodPart: boolean;
    periodYear: number;
    periodColor: string;
}
