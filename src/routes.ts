import { Routes } from '@angular/router';
import { PeopleListPageComponent } from './app/people/router/people-list-page/people-list-page.component';
import { PeopleComponent } from './app/people/router/people/people.component';
import { PersonViewPageComponent } from './app/people/router/person-view-page/person-view-page.component';

export const routes: Routes = [
  { path: '', redirectTo: 'people', pathMatch: 'full' },
  {
    path: 'people',
    component: PeopleComponent,
    children: [
      { path: '', component: PeopleListPageComponent },
      { path: ':id', component: PersonViewPageComponent },
    ],
  },
];
