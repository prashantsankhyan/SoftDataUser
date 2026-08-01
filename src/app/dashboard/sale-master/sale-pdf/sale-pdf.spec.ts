import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePdf } from './sale-pdf';

describe('SalePdf', () => {
  let component: SalePdf;
  let fixture: ComponentFixture<SalePdf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalePdf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalePdf);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
