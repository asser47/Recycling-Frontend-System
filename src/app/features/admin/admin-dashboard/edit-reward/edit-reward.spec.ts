import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRewardComponent } from './edit-reward';

describe('EditReward', () => {
  let component: EditRewardComponent;
  let fixture: ComponentFixture<EditRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRewardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRewardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
