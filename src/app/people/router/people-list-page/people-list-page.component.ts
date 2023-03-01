import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleListComponent } from '../../people-list/people-list.component';
import { List, Person, SearchData } from 'src/app/models';
import { PeopleService } from '../../people.service';
import { map, Observable, switchMap } from 'rxjs';
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
