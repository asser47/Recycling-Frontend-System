import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorMapRequestsComponent } from './map-requests';

describe('CollectorMapRequestsComponent', () => {
  let component: CollectorMapRequestsComponent;
  let fixture: ComponentFixture<CollectorMapRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorMapRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorMapRequestsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
