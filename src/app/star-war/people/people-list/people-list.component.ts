import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { List, Person, SearchData } from '../../models';

@Component({
  selector: 'star-war-people-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './people-list.component.html',
  styleUrls: ['./people-list.component.scss'],
})
export class PeopleListComponent {
  @Input() data!: List<Person>;
  @Input() search?: SearchData;

  @Output() searchChange = new EventEmitter<SearchData>();
  @Output() select = new EventEmitter<string>();

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

  protected get pageOffset(): number {
    return (+(this.search?.page ?? 1) - 1) * 10;
  }

  protected doSearch(): void {
    const value = this.formGroup.value;

    if (!!value.search) {
      this.searchChange.emit(this.formGroup.value);
    } else {
      this.doClear();
    }
  }

  protected doClear(): void {
    this.formGroup.setValue({ search: '' });
    this.searchChange.emit({});
  }

  protected changePage(searchParams?: URLSearchParams): void {
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

  protected doSelect(url: URL): void {
    const id = url.pathname.replace(/\/$/, '').split('/').pop();
    if (!!id) {
      this.select.emit(id);
    }
  }
}
