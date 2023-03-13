import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import {
  EventCreatingData,
  EventQueryParams,
  EventResource,
  EventsList,
  parseEventResource,
  parseEventsList,
} from '../models';
import { TokenService } from './token.service';

const eventsUrl =
  'https://www.googleapis.com/calendar/v3/calendars/primary/events';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly http: HttpClient,
  ) {}

  getAll(params?: EventQueryParams): Observable<EventsList> {
    return this.tokenService.getAuthorizationHeader().pipe(
      switchMap((authorizationHeader) =>
        this.http.get<EventsList>(eventsUrl, {
          headers: {
            Authorization: authorizationHeader,
          },
          params: params,
        }),
      ),
      map(parseEventsList),
    );
  }

  create(data: EventCreatingData): Observable<EventResource> {
    return this.tokenService.getAuthorizationHeader().pipe(
      switchMap((authorizationHeader) =>
        this.http.post<EventResource>(eventsUrl, data, {
          headers: {
            Authorization: authorizationHeader,
          },
        }),
      ),
      map(parseEventResource),
    );
  }
}
