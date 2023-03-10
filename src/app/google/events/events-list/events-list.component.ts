import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { displayEventTimeRange, EventsList } from '../../models';

@Component({
  selector: 'google-events-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent implements OnInit {
  @Input() data!: EventsList;

  protected readonly displayEventTimeRange = displayEventTimeRange;

  ngOnInit(): void {
    if (!this.data) {
      throw new Error(`Property 'data' is required!`);
    }
  }
}
