import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleMaster } from './sale-master';

describe('SaleMaster', () => {
  let component: SaleMaster;
  let fixture: ComponentFixture<SaleMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
