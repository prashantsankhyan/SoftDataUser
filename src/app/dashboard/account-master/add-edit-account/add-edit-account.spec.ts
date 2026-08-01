import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAccount } from './add-edit-account';

describe('AddEditAccount', () => {
  let component: AddEditAccount;
  let fixture: ComponentFixture<AddEditAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
