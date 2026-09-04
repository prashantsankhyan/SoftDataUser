import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasePdf } from './purchase-pdf';

describe('PurchasePdf', () => {
  let component: PurchasePdf;
  let fixture: ComponentFixture<PurchasePdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasePdf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasePdf);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
