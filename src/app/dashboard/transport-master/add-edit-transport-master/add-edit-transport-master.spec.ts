import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTransportMaster } from './add-edit-transport-master';

describe('AddEditTransportMaster', () => {
  let component: AddEditTransportMaster;
  let fixture: ComponentFixture<AddEditTransportMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditTransportMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditTransportMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
