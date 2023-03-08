import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';

import { PeopleListComponent } from '../../../people/people-list/people-list.component';
import { List, Person, SearchData } from '../../../models';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'star-war-people-list-page',
  standalone: true,
  imports: [CommonModule, PeopleListComponent],
  templateUrl: './people-list-page.component.html',
  styleUrls: ['./people-list-page.component.scss'],
})
export class PeopleListPageComponent {
  protected readonly data$: Observable<List<Person>>;

  protected searchData: SearchData | undefined;

  constructor(
    dataService: PeopleService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.data$ = this.route.queryParams.pipe(
      switchMap((params) =>
        dataService.getAll(params).pipe(map((data) => [params, data] as const)),
      ),
      map(([params, data]) => {
        this.searchData = params;
        return data;
      }),
    );
  }

  protected search(searchData: SearchData): void {
    this.router.navigate([], {
      queryParams: searchData,
      replaceUrl: true,
    });
  }

  protected doSelect(id: string): void {
    this.router.navigate([id], {
      relativeTo: this.route,
    });
  }
}
