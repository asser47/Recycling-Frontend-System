import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsMap } from './requests-map';

describe('RequestsMap', () => {
  let component: RequestsMap;
  let fixture: ComponentFixture<RequestsMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestsMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestsMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
