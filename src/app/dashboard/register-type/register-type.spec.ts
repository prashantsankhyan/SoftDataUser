import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterType } from './register-type';

describe('RegisterType', () => {
  let component: RegisterType;
  let fixture: ComponentFixture<RegisterType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterType]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
