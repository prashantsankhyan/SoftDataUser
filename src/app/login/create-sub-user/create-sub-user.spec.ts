import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubUser } from './create-sub-user';

describe('CreateSubUser', () => {
  let component: CreateSubUser;
  let fixture: ComponentFixture<CreateSubUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
