import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditItemGroupMaster } from './add-edit-item-group-master';

describe('AddEditItemGroupMaster', () => {
  let component: AddEditItemGroupMaster;
  let fixture: ComponentFixture<AddEditItemGroupMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditItemGroupMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditItemGroupMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
