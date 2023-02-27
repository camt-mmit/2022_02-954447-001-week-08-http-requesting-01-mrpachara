import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from '../../people-list/people-list.component';
import { List, Person, SearchData } from 'src/app/models';
import { PeopleService } from '../../people.service';
import { Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-people-list-page',
  standalone: true,
  imports: [CommonModule, PeopleListComponent],
  templateUrl: './people-list-page.component.html',
  styleUrls: ['./people-list-page.component.scss'],
})
export class PeopleListPageComponent {
  protected readonly data$: Observable<List<Person>>;

  protected searchData: SearchData;

  constructor(
    dataService: PeopleService,
    route: ActivatedRoute,
    private readonly router: Router,
  ) {
    //this.data$ = dataService.getAll({ page: '3' });
    this.searchData = route.snapshot.queryParams;
    this.data$ = route.queryParams.pipe(
      switchMap((params) => dataService.getAll(params)),
    );
  }

  protected search(searchData: SearchData): void {
    this.router.navigate([], {
      queryParams: searchData,
    });
  }
}
