import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubUserdetails } from './view-sub-userdetails';

describe('ViewSubUserdetails', () => {
  let component: ViewSubUserdetails;
  let fixture: ComponentFixture<ViewSubUserdetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSubUserdetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSubUserdetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
