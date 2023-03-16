import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventCreatingData, EventResource } from '../../models';

@Component({
  selector: 'google-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  @Input() data: EventResource | null = null;

  @Output() dataSubmited = new EventEmitter<EventCreatingData>();
  @Output() cancel = new EventEmitter<void>();

  private readonly fb: NonNullableFormBuilder;

  protected formGroup!: FormGroup<{
    summary: FormControl<string>;
    start: FormGroup<{
      dateTime: FormControl<string>;
    }>;
    end: FormGroup<{
      dateTime: FormControl<string>;
    }>;
  }>;

  constructor(fb: FormBuilder) {
    this.fb = fb.nonNullable;
  }

  ngOnInit(): void {
    const data: Partial<EventResource> = this.data ?? {};

    this.formGroup = this.fb.group({
      summary: this.fb.control(data.summary ?? '', {
        validators: [Validators.required],
        updateOn: 'blur',
      }),
      start: this.fb.group({
        dateTime: this.fb.control(
          this.formatDateTimeLocal(data.start?.dateTime ?? ''),
          {
            validators: [Validators.required],
            updateOn: 'blur',
          },
        ),
      }),
      end: this.fb.group({
        dateTime: this.fb.control(
          this.formatDateTimeLocal(data.end?.dateTime ?? ''),
          {
            validators: [Validators.required],
            updateOn: 'blur',
          },
        ),
      }),
    });
  }

  formatDateTimeLocal(dateTime: string | Date): string {
    return dateTime === ''
      ? ''
      : formatDate(dateTime, 'YYYY-MM-ddThh:mm', 'en-EN');
  }

  protected onSubmit(): void {
    if (this.formGroup.valid) {
      const value = this.formGroup.value;
      const newValue: EventCreatingData = {
        summary: value.summary ?? '',
        start: {
          dateTime: value.start?.dateTime
            ? new Date(value.start.dateTime)
            : new Date(),
        },
        end: {
          dateTime: value.end?.dateTime
            ? new Date(value.end.dateTime)
            : new Date(),
        },
      };
      this.dataSubmited.emit(newValue);
    }
  }

  protected doCancel(): void {
    this.cancel.emit();
  }
}
