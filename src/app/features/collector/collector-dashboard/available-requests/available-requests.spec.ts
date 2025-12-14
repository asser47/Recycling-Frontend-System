import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorAvailableRequestsComponent } from './available-requests';

describe('CollectorAvailableRequestsComponent', () => {
  let component: CollectorAvailableRequestsComponent;
  let fixture: ComponentFixture<CollectorAvailableRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorAvailableRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorAvailableRequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
