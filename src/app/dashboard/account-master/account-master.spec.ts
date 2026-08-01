import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountMaster } from './account-master';

describe('AccountMaster', () => {
  let component: AccountMaster;
  let fixture: ComponentFixture<AccountMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
