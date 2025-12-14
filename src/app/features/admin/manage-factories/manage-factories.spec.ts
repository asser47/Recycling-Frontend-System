import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFactoriesComponent } from './manage-factories';

describe('ManageFactoriesComponent', () => {
  let component: ManageFactoriesComponent;
  let fixture: ComponentFixture<ManageFactoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFactoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFactoriesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
