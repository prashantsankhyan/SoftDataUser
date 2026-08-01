import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingMaster } from './heading-master';

describe('HeadingMaster', () => {
  let component: HeadingMaster;
  let fixture: ComponentFixture<HeadingMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadingMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
