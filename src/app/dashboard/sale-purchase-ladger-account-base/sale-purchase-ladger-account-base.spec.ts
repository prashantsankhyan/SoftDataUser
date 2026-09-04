import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePurchaseLadgerAccountBase } from './sale-purchase-ladger-account-base';

describe('SalePurchaseLadgerAccountBase', () => {
  let component: SalePurchaseLadgerAccountBase;
  let fixture: ComponentFixture<SalePurchaseLadgerAccountBase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalePurchaseLadgerAccountBase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalePurchaseLadgerAccountBase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
