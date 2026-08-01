import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountNameLedger } from './account-name-ledger';

describe('AccountNameLedger', () => {
  let component: AccountNameLedger;
  let fixture: ComponentFixture<AccountNameLedger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountNameLedger]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountNameLedger);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
