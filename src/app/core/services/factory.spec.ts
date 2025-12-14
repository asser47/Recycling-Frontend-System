import { TestBed } from '@angular/core/testing';

import { FactoryService } from './factory.service';

describe('Factory', () => {
  let service: FactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
