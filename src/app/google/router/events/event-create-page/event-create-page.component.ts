import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventFormComponent } from 'src/app/google/events/event-form/event-form.component';
import { EventCreatingData } from 'src/app/google/models';
import { EventsService } from 'src/app/google/services/events.service';
import { take } from 'rxjs';

@Component({
  selector: 'google-event-create-page',
  standalone: true,
  imports: [CommonModule, EventFormComponent],
  templateUrl: './event-create-page.component.html',
  styleUrls: ['./event-create-page.component.scss'],
})
export class EventCreatePageComponent {
  constructor(private readonly dataService: EventsService) {}

  onSubmit(data: EventCreatingData): void {
    this.dataService
      .create(data)
      .pipe(take(1))
      .subscribe(() => history.back());
  }

  onCancel(): void {
    history.back();
  }
}
