import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCategory } from './add-edit-category';

describe('AddEditCategory', () => {
  let component: AddEditCategory;
  let fixture: ComponentFixture<AddEditCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
