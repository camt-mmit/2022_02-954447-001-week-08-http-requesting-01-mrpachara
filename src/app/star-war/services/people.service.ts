import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { parsePeopleList, parsePerson } from '../helpers';
import { List, Person, RawList, RawPerson, SearchData } from '../models';

const url = 'https://swapi.dev/api/people';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  constructor(private readonly http: HttpClient) {}

  getAll(searchData?: SearchData): Observable<List<Person>> {
    return this.http
      .get<RawList<RawPerson>>(url, { params: searchData })
      .pipe(map((obj) => parsePeopleList(obj)));
  }

  get(id: string): Observable<Person> {
    return this.http
      .get<RawPerson>(`${url}/${id}`)
      .pipe(map((obj) => parsePerson(obj)));
  }
}
