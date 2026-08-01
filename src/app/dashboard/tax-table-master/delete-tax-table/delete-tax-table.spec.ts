import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTaxTable } from './delete-tax-table';

describe('DeleteTaxTable', () => {
  let component: DeleteTaxTable;
  let fixture: ComponentFixture<DeleteTaxTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTaxTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTaxTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
