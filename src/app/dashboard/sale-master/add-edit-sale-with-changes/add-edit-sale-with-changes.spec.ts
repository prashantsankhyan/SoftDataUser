import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSaleWithChanges } from './add-edit-sale-with-changes';

describe('AddEditSaleWithChanges', () => {
  let component: AddEditSaleWithChanges;
  let fixture: ComponentFixture<AddEditSaleWithChanges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSaleWithChanges]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSaleWithChanges);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
