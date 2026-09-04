import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHeading } from './purchase-heading';

describe('PurchaseHeading', () => {
  let component: PurchaseHeading;
  let fixture: ComponentFixture<PurchaseHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseHeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
