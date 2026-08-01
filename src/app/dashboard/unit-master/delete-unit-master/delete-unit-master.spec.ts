import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUnitMaster } from './delete-unit-master';

describe('DeleteUnitMaster', () => {
  let component: DeleteUnitMaster;
  let fixture: ComponentFixture<DeleteUnitMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUnitMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteUnitMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
