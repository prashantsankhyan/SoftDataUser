import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRegisterType } from './delete-register-type';

describe('DeleteRegisterType', () => {
  let component: DeleteRegisterType;
  let fixture: ComponentFixture<DeleteRegisterType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRegisterType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRegisterType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
