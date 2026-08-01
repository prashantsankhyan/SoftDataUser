import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditUnitMaster } from './add-edit-unit-master';

describe('AddEditUnitMaster', () => {
  let component: AddEditUnitMaster;
  let fixture: ComponentFixture<AddEditUnitMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditUnitMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditUnitMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
