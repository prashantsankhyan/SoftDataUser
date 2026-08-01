import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSaleHeading } from './add-edit-sale-heading';

describe('AddEditSaleHeading', () => {
  let component: AddEditSaleHeading;
  let fixture: ComponentFixture<AddEditSaleHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSaleHeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSaleHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
