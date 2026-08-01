import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditNarration } from './add-edit-narration';

describe('AddEditNarration', () => {
  let component: AddEditNarration;
  let fixture: ComponentFixture<AddEditNarration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditNarration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditNarration);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
