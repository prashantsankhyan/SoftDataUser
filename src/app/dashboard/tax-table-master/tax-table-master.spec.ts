import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxTableMaster } from './tax-table-master';

describe('TaxTableMaster', () => {
  let component: TaxTableMaster;
  let fixture: ComponentFixture<TaxTableMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxTableMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxTableMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
