import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleHeading } from './sale-heading';

describe('SaleHeading', () => {
  let component: SaleHeading;
  let fixture: ComponentFixture<SaleHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleHeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
