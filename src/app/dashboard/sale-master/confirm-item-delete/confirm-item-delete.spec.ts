import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmItemDelete } from './confirm-item-delete';

describe('ConfirmItemDelete', () => {
  let component: ConfirmItemDelete;
  let fixture: ComponentFixture<ConfirmItemDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmItemDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmItemDelete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
