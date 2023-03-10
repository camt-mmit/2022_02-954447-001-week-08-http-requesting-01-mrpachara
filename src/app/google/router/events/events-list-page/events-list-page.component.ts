import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsListComponent } from 'src/app/google/events/events-list/events-list.component';
import { EventsService } from 'src/app/google/services/events.service';
import { Observable } from 'rxjs';

import { EventsList } from '../../../models';

@Component({
  selector: 'google-events-list-page',
  standalone: true,
  imports: [CommonModule, EventsListComponent],
  templateUrl: './events-list-page.component.html',
  styleUrls: ['./events-list-page.component.scss'],
})
export class EventsListPageComponent {
  protected data$: Observable<EventsList>;

  constructor(private readonly eventsService: EventsService) {
    this.data$ = this.eventsService.getAll({
      singleEvents: true,
      orderBy: 'startTime',
      timeMin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000).toISOString(),
    });
  }
}
