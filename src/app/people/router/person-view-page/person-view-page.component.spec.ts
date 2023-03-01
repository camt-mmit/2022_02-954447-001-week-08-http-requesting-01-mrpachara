import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonViewPageComponent } from './person-view-page.component';

describe('PersonViewPageComponent', () => {
  let component: PersonViewPageComponent;
  let fixture: ComponentFixture<PersonViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PersonViewPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
