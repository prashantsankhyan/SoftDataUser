import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePurchaseHeading } from './delete-purchase-heading';

describe('DeletePurchaseHeading', () => {
  let component: DeletePurchaseHeading;
  let fixture: ComponentFixture<DeletePurchaseHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePurchaseHeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePurchaseHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
