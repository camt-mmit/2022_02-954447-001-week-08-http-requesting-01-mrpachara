import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireTokenComponent } from './require-token.component';

describe('RequireTokenComponent', () => {
  let component: RequireTokenComponent;
  let fixture: ComponentFixture<RequireTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RequireTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequireTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
