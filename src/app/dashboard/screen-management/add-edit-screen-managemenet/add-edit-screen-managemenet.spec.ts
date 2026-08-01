import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditScreenManagemenet } from './add-edit-screen-managemenet';

describe('AddEditScreenManagemenet', () => {
  let component: AddEditScreenManagemenet;
  let fixture: ComponentFixture<AddEditScreenManagemenet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditScreenManagemenet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditScreenManagemenet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
