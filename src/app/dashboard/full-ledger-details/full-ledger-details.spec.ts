import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullLedgerDetails } from './full-ledger-details';

describe('FullLedgerDetails', () => {
  let component: FullLedgerDetails;
  let fixture: ComponentFixture<FullLedgerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullLedgerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullLedgerDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
