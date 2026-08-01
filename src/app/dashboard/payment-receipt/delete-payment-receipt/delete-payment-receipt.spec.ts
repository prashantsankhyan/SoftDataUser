import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePaymentReceipt } from './delete-payment-receipt';

describe('DeletePaymentReceipt', () => {
  let component: DeletePaymentReceipt;
  let fixture: ComponentFixture<DeletePaymentReceipt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletePaymentReceipt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePaymentReceipt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
