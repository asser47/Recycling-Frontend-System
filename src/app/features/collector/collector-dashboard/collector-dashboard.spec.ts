import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorDashboard } from './collector-dashboard';

describe('CollectorDashboard', () => {
  let component: CollectorDashboard;
  let fixture: ComponentFixture<CollectorDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
