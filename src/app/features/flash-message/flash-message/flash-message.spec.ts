import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashMessageComponent } from './flash-message';

describe('FlashMessage', () => {
  let component: FlashMessageComponent;
  let fixture: ComponentFixture<FlashMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashMessageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
export { FlashMessageComponent };

