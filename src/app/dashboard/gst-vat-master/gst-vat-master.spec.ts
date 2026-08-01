import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstVatMaster } from './gst-vat-master';

describe('GstVatMaster', () => {
  let component: GstVatMaster;
  let fixture: ComponentFixture<GstVatMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GstVatMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GstVatMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
