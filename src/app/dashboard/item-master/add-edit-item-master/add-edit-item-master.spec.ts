import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditItemMaster } from './add-edit-item-master';

describe('AddEditItemMaster', () => {
  let component: AddEditItemMaster;
  let fixture: ComponentFixture<AddEditItemMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditItemMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditItemMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
