import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardManagementComponent } from './reward-management';

describe('RewardManagement', () => {
  let component: RewardManagementComponent;
  let fixture: ComponentFixture<RewardManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
