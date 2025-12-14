import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { collectorGuard } from './collector-guard';

describe('collectorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => collectorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
