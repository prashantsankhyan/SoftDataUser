import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportMaster } from './transport-master';

describe('TransportMaster', () => {
  let component: TransportMaster;
  let fixture: ComponentFixture<TransportMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
