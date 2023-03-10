import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import { EventQueryParams, EventsList, parseEventsList } from '../models';
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
      switchMap((authorizationHeader) => {
        return this.http
          .get<EventsList>(eventsUrl, {
            headers: {
              Authorization: authorizationHeader,
            },
            params: params,
          })
          .pipe(map(parseEventsList));
      }),
    );
  }
}
