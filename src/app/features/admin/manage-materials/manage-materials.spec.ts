import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMaterialsComponent } from './manage-materials';

describe('ManageMaterials', () => {
  let component: ManageMaterialsComponent;
  let fixture: ComponentFixture<ManageMaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMaterialsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMaterialsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
