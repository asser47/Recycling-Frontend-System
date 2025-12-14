import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorStatsCardsComponent } from './stats-cards';

describe('CollectorStatsCardsComponent', () => {
  let component: CollectorStatsCardsComponent;
  let fixture: ComponentFixture<CollectorStatsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorStatsCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorStatsCardsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
