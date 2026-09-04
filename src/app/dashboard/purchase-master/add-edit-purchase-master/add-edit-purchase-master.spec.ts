import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPurchaseMaster } from './add-edit-purchase-master';

describe('AddEditPurchaseMaster', () => {
  let component: AddEditPurchaseMaster;
  let fixture: ComponentFixture<AddEditPurchaseMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditPurchaseMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPurchaseMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
