import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTransportMaster } from './delete-transport-master';

describe('DeleteTransportMaster', () => {
  let component: DeleteTransportMaster;
  let fixture: ComponentFixture<DeleteTransportMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTransportMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTransportMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
