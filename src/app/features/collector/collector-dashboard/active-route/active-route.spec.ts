import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorActiveRouteComponent } from './active-route';

describe('CollectorActiveRouteComponent', () => {
  let component: CollectorActiveRouteComponent;
  let fixture: ComponentFixture<CollectorActiveRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorActiveRouteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorActiveRouteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
