import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardsComponent  } from './rewards.component';

describe('RewardManagement', () => {
  let component: RewardsComponent;
  let fixture: ComponentFixture<RewardsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [  RewardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
