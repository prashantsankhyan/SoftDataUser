import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMaster } from './unit-master';

describe('UnitMaster', () => {
  let component: UnitMaster;
  let fixture: ComponentFixture<UnitMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
