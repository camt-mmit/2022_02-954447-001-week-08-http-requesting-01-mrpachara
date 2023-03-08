import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { PersonViewComponent } from '../../../people/person-view/person-view.component';
import { Person } from '../../../models';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'star-war-person-view-page',
  standalone: true,
  imports: [CommonModule, PersonViewComponent],
  templateUrl: './person-view-page.component.html',
  styleUrls: ['./person-view-page.component.scss'],
})
export class PersonViewPageComponent {
  protected readonly data$: Observable<Person>;

  constructor(dataService: PeopleService, route: ActivatedRoute) {
    this.data$ = route.params.pipe(
      switchMap((params) => dataService.get(params['id'])),
    );
  }

  protected doBack(): void {
    history.back();
  }
}
