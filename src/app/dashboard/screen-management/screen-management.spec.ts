import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenManagement } from './screen-management';

describe('ScreenManagement', () => {
  let component: ScreenManagement;
  let fixture: ComponentFixture<ScreenManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
