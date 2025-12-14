import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorHeaderComponent } from './header';

describe('CollectorHeaderComponent', () => {
  let component: CollectorHeaderComponent;
  let fixture: ComponentFixture<CollectorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
