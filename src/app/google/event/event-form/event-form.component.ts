import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
} from '@angular/forms';
import { EventResource } from '../../models';

@Component({
  selector: 'google-event-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  @Input() data: EventResource | null = null;

  private readonly fb: NonNullableFormBuilder;

  protected formGroup!: FormGroup<{
    summary: FormControl<string>;
  }>;

  constructor(fb: FormBuilder) {
    this.fb = fb.nonNullable;
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      summary: this.fb.control(this.data?.summary ?? ''),
    });
  }
}
