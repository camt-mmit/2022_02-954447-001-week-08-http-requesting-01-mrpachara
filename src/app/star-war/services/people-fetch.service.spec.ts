import { TestBed } from '@angular/core/testing';

import { PeopleFetchService } from './people-fetch.service';

describe('PeopleFetchService', () => {
  let service: PeopleFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeopleFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
