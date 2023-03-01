import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleService } from '../../people.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Person } from 'src/app/models';
import { PersonViewComponent } from '../../person-view/person-view.component';

@Component({
  selector: 'app-person-view-page',
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
