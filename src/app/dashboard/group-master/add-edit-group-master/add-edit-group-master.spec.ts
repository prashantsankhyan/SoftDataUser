import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGroupMaster } from './add-edit-group-master';

describe('AddEditGroupMaster', () => {
  let component: AddEditGroupMaster;
  let fixture: ComponentFixture<AddEditGroupMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditGroupMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditGroupMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
