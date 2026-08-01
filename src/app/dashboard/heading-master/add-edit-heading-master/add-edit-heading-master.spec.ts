import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditHeadingMaster } from './add-edit-heading-master';

describe('AddEditHeadingMaster', () => {
  let component: AddEditHeadingMaster;
  let fixture: ComponentFixture<AddEditHeadingMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditHeadingMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditHeadingMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
