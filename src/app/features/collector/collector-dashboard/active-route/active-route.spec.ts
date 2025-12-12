import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveRoute } from './active-route';

describe('ActiveRoute', () => {
  let component: ActiveRoute;
  let fixture: ComponentFixture<ActiveRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveRoute]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveRoute);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
