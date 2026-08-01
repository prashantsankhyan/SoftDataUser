import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteGstVatMaster } from './delete-gst-vat-master';

describe('DeleteGstVatMaster', () => {
  let component: DeleteGstVatMaster;
  let fixture: ComponentFixture<DeleteGstVatMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteGstVatMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteGstVatMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
