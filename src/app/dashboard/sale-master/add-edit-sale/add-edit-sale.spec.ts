import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSale } from './add-edit-sale';

describe('AddEditSale', () => {
  let component: AddEditSale;
  let fixture: ComponentFixture<AddEditSale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSale]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
