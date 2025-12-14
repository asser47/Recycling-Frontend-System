import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorRequestsMapComponent } from './requests-map';

describe('CollectorRequestsMapComponent', () => {
  let component: CollectorRequestsMapComponent;
  let fixture: ComponentFixture<CollectorRequestsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorRequestsMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorRequestsMapComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
