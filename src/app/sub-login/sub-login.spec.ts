import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLogin } from './sub-login';

describe('SubLogin', () => {
  let component: SubLogin;
  let fixture: ComponentFixture<SubLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
