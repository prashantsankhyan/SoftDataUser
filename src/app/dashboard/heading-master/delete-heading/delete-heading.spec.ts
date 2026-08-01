import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHeading } from './delete-heading';

describe('DeleteHeading', () => {
  let component: DeleteHeading;
  let fixture: ComponentFixture<DeleteHeading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteHeading]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteHeading);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
