import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { List, Person, SearchData } from 'src/app/models';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent implements OnInit {
  @Input() data!: List<Person>;
  @Input() search?: SearchData;
  @Output() searchChange = new EventEmitter<SearchData>();

  protected formGroup!: FormGroup<{
    search: FormControl<string>;
  }>;

  private fb: NonNullableFormBuilder;

  constructor(fb: FormBuilder) {
    this.fb = fb.nonNullable;
  }

  ngOnInit(): void {
    if (!this.data) {
      throw new Error(`Property 'data' is required!`);
    }

    this.formGroup = this.fb.group({
      search: this.search?.search ?? '',
    });
  }

  protected doSearch(): void {
    this.searchChange.emit(this.formGroup.value);
  }

  protected page(searchParams?: URLSearchParams): void {
    const searchData = searchParams
      ? {
          ...(searchParams.get('search')
            ? { search: searchParams.get('search')! }
            : {}),
          ...(searchParams.get('page')
            ? { page: searchParams.get('page')! }
            : {}),
        }
      : {};
    this.searchChange.emit(searchData);
  }
}
