import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPurchasePItemDelete } from './confirm-purchase-pitem-delete';

describe('ConfirmPurchasePItemDelete', () => {
  let component: ConfirmPurchasePItemDelete;
  let fixture: ComponentFixture<ConfirmPurchasePItemDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmPurchasePItemDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmPurchasePItemDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
