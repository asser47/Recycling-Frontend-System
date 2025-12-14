import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectorRecentCollectionsComponent } from './recent-collections';

describe('CollectorRecentCollectionsComponent', () => {
  let component: CollectorRecentCollectionsComponent;
  let fixture: ComponentFixture<CollectorRecentCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectorRecentCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectorRecentCollectionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
