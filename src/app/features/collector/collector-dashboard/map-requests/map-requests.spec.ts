import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRequests } from './map-requests';

describe('MapRequests', () => {
  let component: MapRequests;
  let fixture: ComponentFixture<MapRequests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapRequests]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapRequests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
