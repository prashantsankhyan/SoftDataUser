import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPaymentReceipt } from './add-edit-payment-receipt';

describe('AddEditPaymentReceipt', () => {
  let component: AddEditPaymentReceipt;
  let fixture: ComponentFixture<AddEditPaymentReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPaymentReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPaymentReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
