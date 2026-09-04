import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPurchaseHeading } from './add-edit-purchase-heading';

describe('AddEditPurchaseHeading', () => {
  let component: AddEditPurchaseHeading;
  let fixture: ComponentFixture<AddEditPurchaseHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPurchaseHeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPurchaseHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
