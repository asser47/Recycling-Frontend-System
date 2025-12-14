import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorDashboardComponent } from './collector-dashboard';

describe('CollectorDashboardComponent', () => {
  let component: CollectorDashboardComponent;
  let fixture: ComponentFixture<CollectorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
