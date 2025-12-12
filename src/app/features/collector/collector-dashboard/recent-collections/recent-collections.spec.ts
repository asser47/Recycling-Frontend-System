import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentCollections } from './recent-collections';

describe('RecentCollections', () => {
  let component: RecentCollections;
  let fixture: ComponentFixture<RecentCollections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentCollections]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentCollections);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
