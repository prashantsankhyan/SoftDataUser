import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTaxTable } from './add-edit-tax-table';

describe('AddEditTaxTable', () => {
  let component: AddEditTaxTable;
  let fixture: ComponentFixture<AddEditTaxTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTaxTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTaxTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
