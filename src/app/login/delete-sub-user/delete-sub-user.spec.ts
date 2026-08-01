import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSubUser } from './delete-sub-user';

describe('DeleteSubUser', () => {
  let component: DeleteSubUser;
  let fixture: ComponentFixture<DeleteSubUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSubUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSubUser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
