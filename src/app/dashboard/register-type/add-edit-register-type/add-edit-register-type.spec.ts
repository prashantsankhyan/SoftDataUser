import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRegisterType } from './add-edit-register-type';

describe('AddEditRegisterType', () => {
  let component: AddEditRegisterType;
  let fixture: ComponentFixture<AddEditRegisterType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditRegisterType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRegisterType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
