import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGstVatMaster } from './add-edit-gst-vat-master';

describe('AddEditGstVatMaster', () => {
  let component: AddEditGstVatMaster;
  let fixture: ComponentFixture<AddEditGstVatMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditGstVatMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditGstVatMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
